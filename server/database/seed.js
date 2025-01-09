const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTranslation(translationData, translationDetails) {
  console.log(`Inserting/Upserting ${translationDetails.translation} Translation...`);

  // Upsert translation
  const translation = await prisma.translation.upsert({
    where: {
      translation: translationDetails.translation,
    },
    update: {},
    create: {
      translation: translationDetails.translation,
      title: translationDetails.title,
      license: translationDetails.license,
    },
  });

  console.log(`Inserted/Found translation: ${translation.translation}`);

  // Process books, chapters, and verses
  for (const book of translationData.books) {
    console.log(`Processing book: ${book.name}`);

    // Upsert book
    const insertedBook = await prisma.books.upsert({
      where: {
        name_translationId: {
          name: book.name,
          translationId: translation.id,
        },
      },
      update: {},
      create: {
        name: book.name,
        translation: {
          connect: { id: translation.id },
        },
      },
    });

    console.log(`Inserted/Found book: ${insertedBook.name}`);

    for (const chapter of book.chapters) {
      console.log(`Processing chapter: ${chapter.chapter} of book: ${book.name}`);

      // Upsert chapter
      const insertedChapter = await prisma.chapters.upsert({
        where: {
          bookId_number: {
            bookId: insertedBook.id,
            number: chapter.chapter,
          },
        },
        update: {},
        create: {
          number: chapter.chapter,
          book: {
            connect: { id: insertedBook.id },
          },
        },
      });

      console.log(`Inserted/Found chapter: ${insertedChapter.number}`);

      for (const verse of chapter.verses) {
        console.log(
          `Processing verse: ${verse.verse} of chapter: ${chapter.chapter} in book: ${book.name}`
        );

        // Upsert verse
        await prisma.verses.create({
          data: {
            number: verse.verse,
            text: verse.text,
            chapter: {
              connect: { id: insertedChapter.id },
            },
          },
        });

        console.log(
          `Inserted verse: ${verse.verse} - "${verse.text}" for chapter: ${chapter.chapter}`
        );
      }
    }
  }
}

async function main() {
  console.log('Starting database seeding...');

 
  // https://github.com/scrollmapper/bible_databases/tree/2025/formats/json
  // https://get.bible/blog/post/how-to-access-the-bible-via-api-or-download-the-bible-as-data
  // https://www.reddit.com/r/ObsidianMD/comments/rfzl8d/anyone_know_how_i_can_get_the_bible_in_markdown/
  // https://www.esv.org/

  
 // Load JSON data
    // Core
    const asvData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/core/ASV.json'), 'utf-8'));
    const bbeData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/core/BBE.json'), 'utf-8'));
    const lebData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/core/LEB.json'), 'utf-8'));
    const wlcData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/core/WLC.json'), 'utf-8'));  
    const yltData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/core/YLT.json'), 'utf-8'));  
    const kjvData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/core/KJV.json'), 'utf-8')); 
  
    // Historical
    const g1599Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/historical/Geneva1599.json'), 'utf-8'));
    const tyndaleData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/historical/Tyndale.json'), 'utf-8'));
    const darbyData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/historical/Darby.json'), 'utf-8'));
  
    // Catholic
    const cpdvData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/catholic/CPDV.json'), 'utf-8'));
    const drcData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/catholic/DRC.json'), 'utf-8'));
  
    // Modernized
    const bsbData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/modernized/BSB.json'), 'utf-8'));
    const mkjvData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/modernized/MKJV.json'), 'utf-8'));
    const nhebData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seeds/modernized/NHEB.json'), 'utf-8'));
  
    // Greek https://ebible.org/find/country.php?c=GR

  // Translation details
  const kjvDetails = {
    translation: 'KJV',
    title: 'KJV: King James Version (1769) with Strongs Numbers and Morphology and CatchWords',
    license: 'Public Domain',
  };

  const asvDetails = {
    translation: 'ASV',
    title: 'ASV: American Standard Version (1901)',
    license: 'Public Domain',
  };

  const bbeDetails = {
    translation: 'BBE',
    title: 'BBE: 1949/1964 Bible in Basic English',
    license: 'Public Domain',
  };

  const g1599Details = {
    translation: 'G1599',
    title: 'Geneva1599: Geneva Bible (1599)',
    license: 'Public Domain',
  };

  const lebDetails = {
    translation: 'LEB',
    title: 'LEB: The Lexham English Bible',
    license: 'Public Domain',
  };

  const wlcDetails = {
    translation: 'WLC',
    title: 'WLC: Westminster Leningrad Codex',
    license: 'Public Domain',
  };

  const yltDetails = {
    translation: 'YLT',
    title: "YLT: Young's Literal Translation (1898)",
    license: 'Public Domain',
  };

  const tyndaleDetails = {
    translation: 'Tyndale',
    title: 'Tyndale: William Tyndale Bible (1525/1530)',
    license: 'Public Domain',
  };

  const darbyDetails = {
    translation: 'Darby',
    title: 'Darby: Darby Bible (1889)',
    license: 'Public Domain',
  };

  const cpdvDetails = {
    translation: 'CPDV',
    title: 'CPDV: Catholic Public Domain Version',
    license: 'Public Domain',
  };

  const drcetails = {
    translation: 'DRC',
    title: 'DRC: Douay-Rheims Bible, Challoner Revision',
    license: 'Public Domain',
  };

  const bsbDetails = {
    translation: 'BSB',
    title: 'BSB: Berean Standard Bible',
    license: 'Public Domain',
  };

  const mkjvDetails = {
    translation: 'MKJV',
    title: "MKJV: Green's Modern King James Version",
    license: 'Public Domain',
  };

  const nhebDetails = {
    translation: 'NHEB',
    title: 'KNHEB: New Heart English Bible',
    license: 'Public Domain',
  };


  // Seed KJV Translation
  await seedTranslation(kjvData, kjvDetails);
  await seedTranslation(asvData, asvDetails);
  await seedTranslation(bbeData, bbeDetails);
  await seedTranslation(g1599Data, g1599Details);
  await seedTranslation(lebData, lebDetails);
  await seedTranslation(wlcData, wlcDetails);
  await seedTranslation(yltData, yltDetails);
  await seedTranslation(tyndaleData, tyndaleDetails);
  await seedTranslation(darbyData, darbyDetails);
  await seedTranslation(cpdvData, cpdvDetails);
  await seedTranslation(drcData, drcetails);
  await seedTranslation(bsbData, bsbDetails);
  await seedTranslation(mkjvData, mkjvDetails);
  await seedTranslation(nhebData, nhebDetails);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
