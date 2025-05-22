// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Publications by categories in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "A few of my repositories worth looking at",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Please view the Publications page for my academic contributions.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-tutorials",
          title: "tutorials",
          description: "Materials for courses you taught. Replace this text with your description.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/tutorials/";
          },
        },{id: "dropdown-bookshelf",
              title: "bookshelf",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/books/";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
              },
            },{id: "post-2025-already-is-it",
        
          title: "2025 already, is it?",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/2025-already/";
          
        },
      },{id: "post-restarting-in-2024",
        
          title: "Restarting in 2024",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/micron-imagination-hiaccel/";
          
        },
      },{id: "post-on-finding-your-zima-blue",
        
          title: "On Finding Your Zima Blue",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/on-finding-your-zima-blue/";
          
        },
      },{id: "post-on-potential-and-capacity",
        
          title: "On Potential and Capacity",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/on-potential-and-capacity/";
          
        },
      },{id: "post-for-the-earth-that-is-dying",
        
          title: "For The Earth That Is Dying",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/for-the-earth-that-is-dying/";
          
        },
      },{id: "post-why-are-cyborgs-feasible",
        
          title: "Why Are Cyborgs Feasible?",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/cyborgs/";
          
        },
      },{id: "post-yin-and-yang",
        
          title: "Yin and Yang",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/yin-and-yang/";
          
        },
      },{id: "post-an-epiphany-on-anger",
        
          title: "An Epiphany on Anger",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/anger/";
          
        },
      },{id: "post-tea-and-compliments",
        
          title: "Tea And Compliments",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/tea-and-compliments/";
          
        },
      },{id: "post-why-good-people-are-good",
        
          title: "Why Good People Are... Good",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/why-good-people-are-good/";
          
        },
      },{id: "post-for-the-love-of-sleep",
        
          title: "For The Love Of Sleep",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/i-love-to-sleep/";
          
        },
      },{id: "post-serene-mornings",
        
          title: "Serene Mornings",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/serene-mornings/";
          
        },
      },{id: "post-industry-exposure",
        
          title: "Industry Exposure",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/industry-exposure/";
          
        },
      },{id: "post-on-death-and-dark-humour",
        
          title: "On Death and Dark Humour",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/on-death-and-dark-humour/";
          
        },
      },{id: "post-defining-metrics-for-love",
        
          title: "Defining Metrics For Love",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2018/on-love/";
          
        },
      },{id: "post-bouquets-in-porcelain",
        
          title: "Bouquets In Porcelain",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2017/bouquets-in-porcelain/";
          
        },
      },{id: "post-humanitism",
        
          title: "Humanitism",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2017/humanitism/";
          
        },
      },{id: "post-experiences-with-jekyll",
        
          title: "Experiences With Jekyll",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2017/experiences-with-jekyll/";
          
        },
      },{id: "books-man-39-s-search-for-meaning",
          title: 'Man&amp;#39;s Search For Meaning',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/mans_search_for_meaning/";
            },},{id: "books-mastery",
          title: 'Mastery',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/mastery/";
            },},{id: "books-on-computing-the-fourth-great-scientific-domain",
          title: 'On Computing - The Fourth Great Scientific Domain',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/on_computing/";
            },},{id: "books-the-undiscovered-self-the-dilemma-of-the-individual-in-modern-society",
          title: 'The Undiscovered Self - The Dilemma of the Individual in Modern Society',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_undiscovered_self/";
            },},{id: "books-several-short-sentences-about-writing",
          title: 'Several Short Sentences About Writing',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/several_short_sentences_about_writing/";
            },},{id: "books-notes-from-underground",
          title: 'Notes From Underground',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/notes_from_underground/";
            },},{id: "books-a-brief-history-of-intelligence",
          title: 'A Brief History of Intelligence',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/a_brief_history_of_intelligence/";
            },},{id: "news-i-join-mmne-lab-at-bits-pilani-advised-by-dr-sanket-goel",
          title: 'I join MMNE Lab at BITS Pilani advised by Dr. Sanket Goel.',
          description: "",
          section: "News",},{id: "news-i-join-the-processor-design-group-cfaed-at-tud-as-a-guest-researcher-advised-by-dr-akash-kumar",
          title: 'I join the Processor Design group, CFAED at TUD as a guest researcher,...',
          description: "",
          section: "News",},{id: "news-i-have-graduated-sparkles-with-honors-sparkles-from-bits-pilani-smile",
          title: 'I have graduated :sparkles: with Honors :sparkles: from BITS Pilani :smile:',
          description: "",
          section: "News",},{id: "news-i-join-micron-technology-for-development-of-ufs-4-0-storage-controller-asics",
          title: 'I join Micron Technology for development of UFS 4.0 storage controller ASICs.',
          description: "",
          section: "News",},{id: "news-i-tape-out-the-first-chip-of-my-career",
          title: 'I tape out the first chip of my career',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_5/";
            },},{id: "news-excited-to-join-imagination-technologies-for-development-of-automotive-cpus",
          title: 'Excited to join Imagination Technologies for development of automotive CPUs!',
          description: "",
          section: "News",},{id: "news-i-start-my-research-at-hi-accel-lab",
          title: 'I start my research at Hi-Accel Lab.',
          description: "",
          section: "News",},{id: "tutorials-atmega328-register-reference",
          title: 'ATmega328 Register Reference',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-06-23-atmega328-register-reference/";
            },},{id: "tutorials-about-the-series",
          title: 'About The Series',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-06-25-exploiting-an-arduino/";
            },},{id: "tutorials-advanced-i-o",
          title: 'Advanced I/O',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-06-30-advanced-io/";
            },},{id: "tutorials-timers-basic-concepts",
          title: 'Timers - Basic Concepts',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-07-10-timers-basic-concepts/";
            },},{id: "tutorials-timers-gory-details",
          title: 'Timers - Gory Details',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-07-15-timers-gory-details/";
            },},{id: "tutorials-hidden-temperature-sensor",
          title: 'Hidden Temperature Sensor',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-07-22-temperature-sensor/";
            },},{id: "tutorials-eeprom",
          title: 'EEPROM',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-08-05-eeprom/";
            },},{id: "tutorials-faster-adc",
          title: 'Faster ADC',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2017-10-01-faster-adc/";
            },},{id: "tutorials-faster-pwm",
          title: 'Faster PWM',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2018-02-05-faster-pwm/";
            },},{id: "tutorials-debugging-hardware-spi-on-atmega2560",
          title: 'Debugging Hardware SPI on ATMega2560',
          description: "",
          section: "Tutorials",handler: () => {
              window.location.href = "/tutorials/2019-11-07-hardware-spi/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%61%6B%68%69%6C_%62%61%72%61%6E%77%61%6C@%73%66%75.%63%61", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/thecurryspice", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/akhil-raj-baranwal", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=k35PluIAAAAJ", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/akhilrbaranwal", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
