<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition duration-500 py-8">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h1 v-if="selectedBook && selectedChapter" class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        {{ selectedTranslationTitle }} - Book of {{ selectedBookName }}, Chapter {{ selectedChapterNumber }}
      </h1>

      <!-- Error Message -->
      <div v-if="error" class="text-red-500 mb-4">Failed to load data. Please try again.</div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400 mb-4">Loading...</div>

      <!-- Translations Dropdown -->
      <div v-if="!loading && !error" class="mb-4">
        <label
          for="translations"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Select Translation:
        </label>
        <select
          id="translations"
          v-model="selectedTranslation"
          @change="fetchBooks"
          class="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
        >
          <option value="" disabled>Select a translation</option>
          <option v-for="translation in translations" :key="translation.id" :value="translation.id">
            {{ translation.title }}
          </option>
        </select>
      </div>

      <!-- Books Dropdown -->
      <div v-if="!loading && !error && books.length" class="mb-4">
        <label
          for="books"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Select Book:
        </label>
        <select
          id="books"
          v-model="selectedBook"
          @change="fetchChapters"
          class="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
        >
          <option value="" disabled>Select a book</option>
          <option v-for="book in books" :key="book.id" :value="book.id">{{ book.name }}</option>
        </select>
      </div>

      <!-- Chapters Dropdown -->
      <div v-if="!loading && !error && chapters.length" class="mb-4">
        <label
          for="chapters"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Select Chapter:
        </label>
        <select
          id="chapters"
          v-model="selectedChapter"
          @change="fetchVerses"
          class="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
        >
          <option value="" disabled>Select a chapter</option>
          <option v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
            Chapter {{ chapter.number }}
          </option>
        </select>
      </div>

      <!-- Verses List -->
      <div v-if="verses.length" class="transition duration-500 mt-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Verses</h2>
        <ul class="space-y-2">
          <li
            v-for="verse in verses"
            :key="verse.id"
            :class="[ 
              'bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600',
              { 'bg-yellow-200 dark:bg-yellow-600': verse.highlighted }
            ]"
            @click="toggleHighlight(verse)"
          >
            <strong class="text-blue-600 dark:text-blue-400">
              Verse {{ verse.number }}:
            </strong>
            <span class="text-gray-800 dark:text-gray-300">{{ verse.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      translations: [],
      books: [],
      chapters: [],
      verses: [],
      selectedTranslation: null,
      selectedTranslationTitle: null,
      selectedBook: null,
      selectedBookName: null,
      selectedChapter: null,
      selectedChapterNumber: null,
      loading: true,
      error: false,
    };
  },
  async created() {
    try {
      this.loading = true;
      await this.fetchTranslations();
    } catch {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchTranslations() {
      try {
        const response = await $fetch('/api/translations');
        this.translations = response.translations;
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    },
    async fetchBooks() {
      if (!this.selectedTranslation) return;

      try {
        const response = await $fetch(`/api/books?translationId=${this.selectedTranslation}`);
        this.books = response.books;
        this.selectedTranslationTitle = this.translations.find(
          (t) => t.id === this.selectedTranslation
        )?.title;
        this.chapters = [];
        this.verses = [];
        this.selectedBook = null;
        this.selectedChapter = null;
        this.selectedBookName = null;
        this.selectedChapterNumber = null;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },
    async fetchChapters() {
      if (!this.selectedBook) return;

      try {
        const response = await $fetch(`/api/chapters?bookId=${this.selectedBook}`);
        this.chapters = response.chapters;
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    },
    async fetchVerses() {
      if (!this.selectedChapter) return;
      const authToken = Cookies.get('auth_token');
      console.log("XXXX" + this.fetchAuthToken());
      try {
        const response = await $fetch(`/api/verses?chapterId=${this.selectedChapter}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        this.verses = response.verses;
      } catch (error) {
        console.error('Error fetching verses:', error);
      }
    },
    async toggleHighlight(verse) {
      try {
        verse.highlighted = !verse.highlighted;
        const authToken = Cookies.get('auth_token');

        await $fetch('/api/highlight', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
          body: {
            verseId: verse.id,
            highlighted: verse.highlighted,
          },
        });
      } catch (error) {
        console.error('Error toggling highlight:', error);
      }
    },
    async fetchAuthToken() {
      try {
        const response = await $fetch('/api/auth/getCookie');
        console.log('Auth Tokenz:', response.authToken);
        return response.authToken;
      } catch (error) {
        console.error('Error fetching auth token:', error);
        return null;
      }
    },
  },
  mounted() {
    this.fetchAuthToken();
  },
};
</script>

<style>
.bg-yellow-200.dark\:bg-yellow-500 {
  transition: background-color 0.3s ease;
}
</style>
