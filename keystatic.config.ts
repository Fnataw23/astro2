import { config, fields, collection, singleton } from '@keystatic/core';

const isProd = process.env.NODE_ENV === 'production';

export default config({
  storage: isProd
    ? {
        kind: 'cloud',
      }
    : {
        kind: 'local',
      },
  cloud: {
    project: 'test3/astro-keystatic-blog',
  },
  collections: {
    categories: collection({
      label: 'Категории',
      slugField: 'name',
      path: 'src/content/categories/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Название категории' } }),
      },
    }),
    posts: collection({
      label: 'Статьи',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Заголовок статьи' } }),
        description: fields.text({
          label: 'Краткое описание (анонс)',
          multiline: true,
        }),
        date: fields.date({
          label: 'Дата публикации',
          defaultValue: { kind: 'today' },
        }),
        category: fields.relationship({
          label: 'Категория',
          collection: 'categories',
          validation: { isRequired: true },
        }),
        coverImage: fields.image({
          label: 'Обложка (фото)',
          directory: 'public/images/posts',
          publicPath: '/images/posts',
        }),
        videoUrl: fields.text({
          label: 'Ссылка на видео (YouTube / Rutube / VK Video / Vimeo)',
          description: 'Например, https://www.youtube.com/watch?v=... или https://rutube.ru/video/...',
        }),
        videoFile: fields.file({
          label: 'Или загрузить видеофайл напрямую (до 100 МБ)',
          directory: 'public/videos/posts',
          publicPath: '/videos/posts',
        }),
        content: fields.markdoc({
          label: 'Содержимое статьи',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts',
            },
          },
        }),
      },
    }),
  },
  singletons: {
    homepage: singleton({
      label: 'Главная страница',
      path: 'src/content/homepage/index',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Заголовок на главной', defaultValue: 'Полезные статьи о ремонте' }),
        description: fields.text({
          label: 'Подзаголовок на главной',
          multiline: true,
          defaultValue: 'Экспертные разборы, советы по выбору материалов и пошаговые инструкции от профессионалов.'
        }),
      },
    }),
    ads: singleton({
      label: 'Реклама и баннеры',
      path: 'src/content/ads/index',
      format: { data: 'json' },
      schema: {
        yandexDirectHeader: fields.text({
          label: 'Код Яндекс Директа на главной',
          multiline: true,
          description: 'Вставьте JavaScript код блока RTB (обычно горизонтальный баннер)'
        }),
        yandexDirectArticle: fields.text({
          label: 'Код Яндекс Директа под статьей',
          multiline: true,
          description: 'Вставьте JavaScript код блока RTB'
        }),
        showCustomBanner: fields.checkbox({
          label: 'Показывать собственный баннер вместо Директа',
          defaultValue: false
        }),
        customBannerImage: fields.image({
          label: 'Картинка баннера',
          directory: 'public/images/ads',
          publicPath: '/images/ads',
        }),
        customBannerLink: fields.text({
          label: 'Ссылка для перехода по баннеру'
        }),
      }
    }),
    settings: singleton({
      label: 'Настройки сайта',
      path: 'src/content/settings/index',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({ label: 'Название сайта', defaultValue: 'МастерБлог' }),
        siteDescription: fields.text({
          label: 'Описание сайта (для SEO)',
          multiline: true,
          defaultValue: 'Информационный портал со статьями о строительстве, ремонте, сантехнике и дизайне.'
        }),
        telegramBotToken: fields.text({
          label: 'Токен Telegram-бота (для заявок)',
          description: 'Получите у @BotFather. Пример: 123456789:ABCdefGhI...'
        }),
        telegramChatId: fields.text({
          label: 'ID чата Telegram (куда слать заявки)',
          description: 'ID группы или вашего аккаунта. Можно узнать у @userinfobot'
        }),
        sidebarBannerTitle: fields.text({
          label: 'Заголовок баннера в сайдбаре',
          defaultValue: 'Рассчитать смету ремонта'
        }),
        sidebarBannerText: fields.text({
          label: 'Описание баннера в сайдбаре',
          defaultValue: 'Получите точный расчет стоимости работ и материалов за 5 минут!'
        }),
        sidebarBannerLink: fields.text({
          label: 'Ссылка для кнопки баннера',
          defaultValue: '/#contact'
        }),
        sidebarBannerButtonText: fields.text({
          label: 'Текст кнопки баннера',
          defaultValue: 'Рассчитать смету'
        }),
      }
    }),
  },
});
