// ==========================================================================
// UKUSA — SPECIALTY CAFÉ & ROASTERY DATA
// ==========================================================================

window.UKUSA_DATA = {
  categories: [
    { id: "espresso", label: "Espresso & Coffee", count: "05" },
    { id: "signature", label: "Signature Drinks", count: "04" },
    { id: "matcha", label: "Matcha & Tea", count: "04" },
    { id: "bakery", label: "Artisanal Bakery", count: "04" },
    { id: "bites", label: "All-Day Bites", count: "03" }
  ],

  menuItems: [
    // ESPRESSO & COFFEE
    {
      id: "esp-01",
      category: "espresso",
      code: "ESP // 01",
      name: "Obsidian Double Espresso",
      price: 4.50,
      tastingNotes: "DARK CACAO · MOLASSES · SMOKED CEDAR",
      origin: "Sidama, Ethiopia (Washed / 2,100m)",
      description: "Pulled at 9 bars with a 1:2 extraction ratio. Syrupy body, dense tiger-striped crema, lingering bittersweet cacao finish.",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: false,
      defaultTemp: "Hot",
      tags: ["BOLD", "SINGLE ORIGIN"]
    },
    {
      id: "esp-02",
      category: "espresso",
      code: "ESP // 02",
      name: "Velvet Oat Cortado",
      price: 5.50,
      tastingNotes: "TOASTED HAZELNUT · CARAMEL · SILK",
      origin: "Huila, Colombia + Minor Figures Barista Oat",
      description: "Equal parts double ristretto and micro-steamed oat milk folded at 58°C for natural sweetness and satin texture.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Hot",
      tags: ["BARISTA PICK", "BALANCED"]
    },
    {
      id: "esp-03",
      category: "espresso",
      code: "ESP // 03",
      name: "V60 Gesha Pour-Over",
      price: 8.50,
      tastingNotes: "JASMINE BLOSSOM · BERGAMOT · WHITE PEACH",
      origin: "Boquete, Panama (Natural Anaerobic)",
      description: "Hand-brewed to order over a 3-minute bloom and pulse pour cycle. Tea-like clarity with explosive floral aromatics.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Hot",
      tags: ["RARE LOT", "FLORAL"]
    },
    {
      id: "esp-04",
      category: "espresso",
      code: "ESP // 04",
      name: "Kyoto 18-Hour Slow Drip",
      price: 6.75,
      tastingNotes: "BOURBON VANILLA · CHERRY · DARK CHOCOLATE",
      origin: "Antigua, Guatemala",
      description: "Extracted drop by drop through blown-glass towers over 18 hours with glacial water. Whiskey-like viscosity and zero bitterness.",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: false,
      defaultTemp: "Iced",
      tags: ["LIMITED", "COLD EXTRACTION"]
    },
    {
      id: "esp-05",
      category: "espresso",
      code: "ESP // 05",
      name: "Crema Flat White",
      price: 5.75,
      tastingNotes: "BROWN BUTTER · NOUGAT · ROASTED ALMOND",
      origin: "Cerrado, Brazil + Sidama Blend",
      description: "Our signature house blend paired with glossy, ultra-fine microfoam poured with high-contrast rosetta art.",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Hot",
      tags: ["CLASSIC"]
    },

    // SIGNATURE DRINKS
    {
      id: "sig-01",
      category: "signature",
      code: "SIG // 01",
      name: "Smoked Black Sesame Latte",
      price: 7.25,
      tastingNotes: "CHARRED SESAME · TAHINI · ESPRESSO · SEA SALT",
      origin: "House Black Sesame Reduction + Double Ristretto",
      description: "Stone-ground Japanese black sesame paste whisked with raw wildflower honey, espresso, and topped with smoked Maldon salt foam.",
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Iced",
      tags: ["SIGNATURE", "EARTHY"]
    },
    {
      id: "sig-02",
      category: "signature",
      code: "SIG // 02",
      name: "Yuzu Espresso Tonic",
      price: 7.00,
      tastingNotes: "KOCHI YUZU · BOTANICAL QUININE · BRIGHT CITRUS",
      origin: "Ethiopian Espresso + Artisanal Yuzu Tonic",
      description: "Sparkling botanical tonic layered with cold-pressed Kochi yuzu juice and floated with a fruit-forward single-origin espresso shot.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: false,
      defaultTemp: "Iced",
      tags: ["EFFERVESCENT", "REFRESHING"]
    },
    {
      id: "sig-03",
      category: "signature",
      code: "SIG // 03",
      name: "Cardamom Burnt Honey Cortado",
      price: 6.50,
      tastingNotes: "CARAMELIZED HONEY · GREEN CARDAMOM · ORANGE PEEL",
      origin: "House Infused Amber Honey + Double Espresso",
      description: "Wildflower honey caramelized to the brink of smoke, infused with crushed green cardamom pods and finished with expressed Seville orange oil.",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Hot",
      tags: ["SPICED", "WARMING"]
    },
    {
      id: "sig-04",
      category: "signature",
      code: "SIG // 04",
      name: "Cascara Misugaru Cloud",
      price: 7.50,
      tastingNotes: "ROASTED BARLEY · COFFEE CHERRY · SWEET CREAM",
      origin: "Korean 7-Grain Misugaru + Cascara Reduction",
      description: "Toasted multigrain infusion layered over iced espresso and crowned with a velvety cascara-infused cold cream cap.",
      image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: false,
      defaultTemp: "Iced",
      tags: ["CREAMY", "NEW"]
    },

    // MATCHA & TEA
    {
      id: "mat-01",
      category: "matcha",
      code: "MAT // 01",
      name: "Uji First-Harvest Ceremonial Matcha",
      price: 7.00,
      tastingNotes: "UMAMI · SWEET GRASS · WHITE CHOCOLATE",
      origin: "Uji, Kyoto (Samidori Cultivar)",
      description: "Hand-whisked to order using a 100-prong bamboo chasen at 75°C. Vibrant emerald crema with zero astringency.",
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Hot",
      tags: ["CEREMONIAL", "UMAMI"]
    },
    {
      id: "mat-02",
      category: "matcha",
      code: "MAT // 02",
      name: "Roasted Hojicha Oat Fog",
      price: 6.75,
      tastingNotes: "CHARRED BAMBOO · TOFFEE · VANILLA BEAN",
      origin: "Shizuoka Dark-Roast Bancha",
      description: "Slow-roasted green tea stems stone-milled into a fine cocoa-hued powder, whisked with Madagascar vanilla bean syrup and steamed oat milk.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Hot",
      tags: ["LOW CAFFEINE", "ROASTY"]
    },
    {
      id: "mat-03",
      category: "matcha",
      code: "MAT // 03",
      name: "Salted Pistachio Matcha Cloud",
      price: 7.75,
      tastingNotes: "BRONTE PISTACHIO · EMERALD MATCHA · SEA SALT",
      origin: "Uji Matcha + Roasted Sicilian Pistachio Cream",
      description: "Iced ceremonial matcha poured over oat milk and topped with a thick, savory-sweet roasted pistachio cold foam.",
      image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: false,
      defaultTemp: "Iced",
      tags: ["CULT FAVORITE"]
    },
    {
      id: "mat-04",
      category: "matcha",
      code: "MAT // 04",
      name: "High-Mountain Smoked Oolong",
      price: 6.00,
      tastingNotes: "ORCHID · MINERAL SPRING · ROASTED CHESTNUT",
      origin: "Alishan, Taiwan (1,600m Elevation)",
      description: "Whole-leaf oolong steeped gongfu-style in clay vessels. Rich golden liquor with a lingering honeyed orchid aroma.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85",
      isDrink: true,
      allowTemp: true,
      defaultTemp: "Hot",
      tags: ["SINGLE ESTATE"]
    },

    // ARTISANAL BAKERY
    {
      id: "bak-01",
      category: "bakery",
      code: "BAK // 01",
      name: "Black Sesame Kouign-Amann",
      price: 6.25,
      tastingNotes: "SHATTERING CARAMEL · CULTURED BUTTER · SESAME",
      origin: "72-Hour Laminated French Isigny Butter Dough",
      description: "Crisp caramelized sugar crust outside, honeycomb layers folded with roasted black sesame frangipane and flaky sea salt inside.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
      isDrink: false,
      tags: ["BAKED FRESH", "LAMINATED"]
    },
    {
      id: "bak-02",
      category: "bakery",
      code: "BAK // 02",
      name: "Miso Brown Butter Canele",
      price: 5.25,
      tastingNotes: "BEESWAX CRUST · WHITE MISO · RUM CUSTARD",
      origin: "Bordeaux Copper Mold Baked",
      description: "Baked in traditional beeswax-lined copper molds for a deeply mahogany, crunchy exterior and a custardy umami-caramel center.",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=85",
      isDrink: false,
      tags: ["UMAMI SWEET"]
    },
    {
      id: "bak-03",
      category: "bakery",
      code: "BAK // 03",
      name: "Yuzu Pistachio Twice-Baked Croissant",
      price: 6.75,
      tastingNotes: "YUZU CURD · ROASTED PISTACHIO · GOLDEN PASTRY",
      origin: "Naturally Leavened Croissant + Sicilian Pistachio",
      description: "Filled with bright Kochi yuzu curd and rum-soaked pistachio frangipane, twice-baked until shattering and dusted with crushed nuts.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
      isDrink: false,
      tags: ["CHEF'S SPECIAL"]
    },
    {
      id: "bak-04",
      category: "bakery",
      code: "BAK // 04",
      name: "Cardamom Espresso Brioche Knot",
      price: 5.75,
      tastingNotes: "FRESH GROUND CARDAMOM · ESPRESSO GLAZE · PEARL SUGAR",
      origin: "Nordic-Style Braided Sourdough Brioche",
      description: "Featherlight sourdough brioche twisted with freshly mortared green cardamom butter and brushed with an espresso-bean syrup glaze.",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=85",
      isDrink: false,
      tags: ["WARM & SPICED"]
    },

    // ALL-DAY BITES
    {
      id: "bit-01",
      category: "bites",
      code: "BIT // 01",
      name: "Whipped Ricotta & Charred Fig Tartine",
      price: 13.50,
      tastingNotes: "BLACK MISSION FIG · THYME HONEY · COUNTRY SOURDOUGH",
      origin: "36-Hour Fermented Country Miche",
      description: "Thick-cut hearth sourdough grilled in olive oil, layered with lemon-zested sheep's ricotta, torched figs, toasted walnuts, and smoked honey.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",
      isDrink: false,
      tags: ["SAVORY-SWEET"]
    },
    {
      id: "bit-02",
      category: "bites",
      code: "BIT // 02",
      name: "Truffle Tamago Brioche Sando",
      price: 14.50,
      tastingNotes: "SOFT SCRAMBLED EGG · BLACK TRUFFLE · CHIVE AIOLI",
      origin: "Hokkaido Milk Shokupan",
      description: "Jammy heritage eggs folded with crème fraîche and shaved black truffle, tucked inside toasted shokupan with yuzu-kosho kewpie.",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85",
      isDrink: false,
      tags: ["HOUSE FAVORITE"]
    },
    {
      id: "bit-03",
      category: "bites",
      code: "BIT // 03",
      name: "Smoked Trout & Pickled Fennel Toast",
      price: 15.50,
      tastingNotes: "CULTURED LABNEH · DILL OIL · CRISPY CAPERS",
      origin: "Danish Seeded Rugbrød",
      description: "Dense sprouted rye bread topped with herbed labneh, oak-smoked rainbow trout, shaved saffron fennel, and crispy fried capers.",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=85",
      isDrink: false,
      tags: ["NORDIC INSPIRED"]
    }
  ],

  photoStack: [
    {
      id: "card-1",
      index: "01 / 05",
      title: "SMALL-BATCH PROBAT ROASTING",
      subtitle: "TEMP CURVE // 204°C FIRST CRACK",
      caption: "Every lot is profiled on our cast-iron 1968 Probat UG22 to preserve delicate terroir aromatics without roast defect.",
      image: "https://images.unsplash.com/photo-1511537190424-style?auto=format&fit=crop&w=900&q=85",
      fallbackImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "card-2",
      index: "02 / 05",
      title: "ARCHITECTURAL CONCRETE & OAK",
      subtitle: "SPATIAL DESIGN // KYOTO × ZÜRICH",
      caption: "Raw board-formed concrete meets charred sugi cedar and warm acoustic brass diffusers designed for slow sensory immersion.",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "card-3",
      index: "03 / 05",
      title: "PRECISION EXTRACTION LAB",
      subtitle: "REFRACTOMETRY // 21.4% TDS YIELD",
      caption: "Custom remineralized water profiles tailored separately for espresso pressure curves and gravity-fed pour-overs.",
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "card-4",
      index: "04 / 05",
      title: "72-HOUR LAMINATION ATELIER",
      subtitle: "FERMENTATION // CULTURED ISIGNY BUTTER",
      caption: "Our pastry team folds heirloom grain doughs at dawn, pairing French lamination with Japanese umami botanicals.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "card-5",
      index: "05 / 05",
      title: "VINYL & ANALOG LISTENING ROOM",
      subtitle: "ACOUSTICS // KLIPSCHORN + MCINTOSH TUBE",
      caption: "Ambient jazz, dub, and neo-classical selections spun from warm analog pressings throughout the day.",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85"
    }
  ],

  spaceGallery: [
    {
      id: "sp-01",
      code: "ZONE 01 // THE ESPRESSO BAR",
      title: "MONOLITHIC BASALT COUNTER",
      specs: "38°43'N 9°08'W · CUSTOM MODBAR AV",
      description: "Under-counter boilers remove visual barrier between guest and barista, turning every extraction into shared theater.",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85"
    },
    {
      id: "sp-02",
      code: "ZONE 02 // POUR-OVER SANCTUARY",
      title: "SLOW DRIP & CERAMIC ALCOVE",
      specs: "HAND-THROWN BIZEN WARE · 93.5°C",
      description: "An intimate six-seat timber bar dedicated to rare micro-lot Gesha infusions and ceremonial Uji matcha whisking.",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85"
    },
    {
      id: "sp-03",
      code: "ZONE 03 // THE ATRIUM COURTYARD",
      title: "FILTERED DAYLIGHT & MOSS GARDEN",
      specs: "NORTHERN SKYLIGHT · ACOUSTIC PLASTER",
      description: "Suspended blackened steel planters and diffused skylight create a quiet sanctuary insulated from city tempo.",
      image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=85"
    },
    {
      id: "sp-04",
      code: "ZONE 04 // ROASTERY & CUPPING TABLE",
      title: "GLASS-WALLED SENSORY LAB",
      specs: "PROBAT UG22 · WEEKLY PUBLIC CUPPINGS",
      description: "Watch green single-origin lots transform into aromatic roast batches while sampling experimental fermentations.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
    },
    {
      id: "sp-05",
      code: "ZONE 05 // LATTE ART & TEXTURE",
      title: "LIQUID VELVET MICROFOAM",
      specs: "58°C STEAMING · HIGH-CONTRAST CREMA",
      description: "Precision milk chemistry folded into dense, tiger-mottled espresso shots for tactile silkiness in every sip.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85"
    }
  ]
};
