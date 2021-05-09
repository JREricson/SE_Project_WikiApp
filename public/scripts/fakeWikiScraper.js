const getImageWikiService = (url, item) => {
  let urlParts = url.split("/");
  let wikiPath = urlParts[urlParts.length - 1];
  console.log(wikiPath);
  let desc;
  switch (wikiPath) {
    case "Lake_Huron":
      desc = `Lake Huron /ˈhjʊrɒn, ˈhjʊrən/ is one of the five Great Lakes of North America. Hydrologically, it comprises the easterly portion of Lake Michigan–Huron, having the same surface elevation as its westerly counterpart, to which it is connected by the 5-mile-wide (8.0 km), 20-fathom-deep (120 ft; 37 m) Straits of Mackinac. It is shared on the north and east by the Canadian province of Ontario and on the south and west by the U.S. state of Michigan. The name of the lake is derived from early French explorers who named it for the Huron people inhabiting the region. The Huronian glaciation was named from evidence collected from Lake Huron region. The northern parts of the lake include the North Channel and Georgian Bay. Saginaw Bay is located in the southwest corner of the lake. The main inlet is the St. Marys River, and the main outlet is the St. Clair River. `;
      break;
    case "Lake_Erie":
      desc = `Lake Erie is the fourth-largest lake (by surface area) of the five Great Lakes in North America and the eleventh-largest globally.[6][10] It is the southernmost, shallowest, and smallest by volume of the Great Lakes[11][12] and therefore also has the shortest average water residence time. At its deepest point Lake Erie is 210 feet (64 metres) deep. Situated on the International Boundary between Canada and the United States, Lake Erie's northern shore is the Canadian province of Ontario, specifically the Ontario Peninsula, with the U.S. states of Michigan, Ohio, Pennsylvania, and New York on its western, southern, and eastern shores. These jurisdictions divide the surface area of the lake with water boundaries.

      Situated below Lake Huron, Erie's primary inlet is the Detroit River. The main natural outflow from the lake is via the Niagara River, which provides hydroelectric power to Canada and the U.S. as it spins huge turbines near Niagara Falls at Lewiston, New York and Queenston, Ontario.[13] Some outflow occurs via the Welland Canal, part of the Saint Lawrence Seaway, which diverts water for ship passages from Port Colborne, Ontario on Lake Erie, to St. Catharines on Lake Ontario, an elevation difference of 326 ft (99 m). Lake Erie's environmental health has been an ongoing concern for decades, with issues such as overfishing, pollution, algae blooms, and eutrophication generating headlines.[14][15] `;

      break;
    case "Lake_Michigan":
      desc = `Lake Michigan is one of the five Great Lakes of North America. It is the second-largest of the Great Lakes by volume[5] (1,180 cu mi (4,900 km3)) and the third-largest by surface area (22,404 sq mi (58,030 km2)), after Lake Superior and Lake Huron. To the east, its basin is conjoined with that of Lake Huron through the narrow Straits of Mackinac, giving it the same surface elevation as its easterly counterpart; the two are technically a single lake.[8]

      Lake Michigan is the largest lake by area in one country.[9] Located in the United States, it is shared, from west to east, by the states of Wisconsin, Illinois, Indiana, and Michigan. Ports along its shores include Milwaukee and the City of Green Bay in Wisconsin; Chicago in Illinois; Gary in Indiana; and Muskegon in Michigan. Green Bay is a large bay in its northwest, and Grand Traverse Bay is in the northeast. The word "Michigan" is believed to come from the Ojibwe word michi-gami meaning "great water".[10] `;
      break;
    case "Lake_Ontario":
      desc = `Lake Ontario is one of the five Great Lakes of North America. It is surrounded on the north, west, and southwest by the Canadian province of Ontario, and on the south and east by the U.S. state of New York, whose water boundaries meet in the middle of the lake. Ontario, Canada's most populous province, was named for the lake.

      The Canadian cities of Toronto, Kingston, and Hamilton are located on the lake's northern and western shorelines, while the American city of Rochester is located on the south shore. In the Huron language, the name Ontarí'io means "great lake". Its primary inlet is the Niagara River from Lake Erie. The last in the Great Lakes chain, Lake Ontario serves as the outlet to the Atlantic Ocean via the Saint Lawrence River, comprising the eastern end of the Saint Lawrence Seaway. It is the only Great Lake not to border the state of Michigan. `;
      break;

    case "Lake_Superior":
      desc = `Lake Superior is the largest of the Great Lakes of North America, and among freshwater lakes, it is the world's largest by surface area and the third-largest by volume.[a] It is shared by Ontario, Canada to the north, and states in the United States in other directions: Minnesota to the west, and Wisconsin and the Upper Peninsula of Michigan to the south.[12] Lake Superior is the most northerly and most westerly of the Great Lakes chain, and the highest in elevation. It drains into Lake Huron via St. Mary's River. `;
      break;
    ////
    case "Sahara":
      desc = `The Sahara (/səˈhɑːrə/, /səˈhærə/; Arabic: الصحراء الكبرى‎, aṣ-ṣaḥrāʼ al-kubrá, 'the Greatest Desert') is a desert on the African continent. With an area of 9,200,000 square kilometres (3,600,000 sq mi), it is the largest hot desert in the world and the third largest desert overall, smaller only than the deserts of Antarctica and the northern Arctic.[1][2][3]

      The name "Sahara" is derived from the Arabic word for "desert" in the feminine irregular form, the singular ṣaḥra' (صحراء /ˈsˤaħra/), plural ṣaḥārā (صَحَارَى /ˈsˤaħaːraː/[4][5][6][7]), ṣaḥār (صَحَار), ṣaḥrāwāt (صَحْارَاوَات), ṣaḥāriy (صَحَارِي).
      
      The desert comprises much of North Africa, excluding the fertile region on the Mediterranean Sea coast, the Atlas Mountains of the Maghreb, and the Nile Valley in Egypt and Sudan. It stretches from the Red Sea in the east and the Mediterranean in the north to the Atlantic Ocean in the west, where the landscape gradually changes from desert to coastal plains. To the south, it is bounded by the Sahel, a belt of semi-arid tropical savanna around the Niger River valley and the Sudan Region of Sub-Saharan Africa. The Sahara can be divided into several regions, including the western Sahara, the central Ahaggar Mountains, the Tibesti Mountains, the Aïr Mountains, the Ténéré desert, and the Libyan Desert.
      
      For several hundred thousand years, the Sahara has alternated between desert and savanna grassland in a 20,000 year cycle[8] caused by the precession of the Earth's axis as it rotates around the Sun, which changes the location of the North African Monsoon. The area is next expected to become green in about 15,000 years (17,000 CE). `;
      break;
    case "Gobi_Desert":
      desc = `The Gobi Desert (/ˈɡoʊbi/) is a large desert or brushland region in East Asia.[1] It covers parts of Northern and Northeastern China and of Southern Mongolia. The desert basins of the Gobi are bounded by the Altai Mountains and the grasslands and steppes of Mongolia on the north, by the Taklamakan Desert to the west, by the Hexi Corridor and Tibetan Plateau to the southwest and by the North China Plain to the southeast. The Gobi is notable in history as the location of several important cities along the Silk Road.

        The Gobi is a rain shadow desert, formed by the Tibetan Plateau blocking precipitation from the Indian Ocean reaching the Gobi territory. It is the 6th largest desert in the world and the 2nd largest in Asia. `;
      break;
    default:
  }
  item.desc = desc;
};
ListDataObj.lst_items.forEach((item) => {
  //testDiv.innerHTML += ` <p>${item.itm_Name}:<a href="${item.itm_url}">link</a></p>`;
  //getImageFakeService(item.itm_url, item);
  getImageWikiService(item.itm_url, item);
});
