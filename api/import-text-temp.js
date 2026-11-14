import { put } from '@vercel/blob';

const DATA = [
  {n:1,title:`Historia 5 — okładka`,p:[`Historia. Podręcznik. 5.`,`Gdańskie Wydawnictwo Oświatowe.`]},
  {n:2,title:`Historia 5 — strona tytułowa`,p:[`Tomasz Małkowski.`,`Historia 5. Podręcznik dla klasy piątej szkoły podstawowej.`,`Gdańskie Wydawnictwo Oświatowe.`]},
  {n:3,title:`Spis treści`,p:[
    `1. Czas w historii — 6.`,`I. Początki cywilizacji.`,
    `2. Od myśliwych do rolników — 11. 3. Cywilizacje Sumerów, doliny Indusu i Chin — 17. 4. Starożytny Egipt — 22. 5. Wierzenia starożytnych Egipcjan — 28. 6. Starożytny Izrael — 34.`,
    `II. Starożytna Grecja.`,`7. Demokracja ateńska — 39. 8. Mitologia grecka — 44. 9. Na olimpijskim stadionie — 48. 10. Co zawdzięczamy starożytnym Grekom? — 54.`,
    `III. Antyczny Rzym.`,`11. Od republiki do cesarstwa — 60. 12. Społeczeństwo antycznego Rzymu — 65. 13. Osiągnięcia starożytnych Rzymian — 70. 14. Narodziny chrześcijaństwa — 76.`,
    `IV. Czasy średniowiecza.`,`15. Cesarstwo bizantyjskie — 82. 16. Początki islamu — 89. 17. Państwo Karola Wielkiego — 94. 18. Nowe państwa w Europie — 99. 19. Walka cesarza z papieżem — 104. 20. Wyprawy krzyżowe — 108.`,
    `V. Społeczeństwo średniowiecznej Europy.`,`21. Feudalna Europa — 114. 22. Na rycerskim zamku — 119. 23. Średniowieczni mieszczanie i chłopi — 124. 24. Duchowieństwo i kultura średniowiecza — 131.`,
    `VI. Polska pierwszych Piastów.`,`25. Początki Polski — 137. 26. Polska Bolesława Chrobrego — 142. 27. W najdawniejszej Polsce — 148. 28. Upadek i odbudowa państwa — 154. 29. Polska Bolesława Krzywoustego — 159.`,
    `VII. Polska rozbita na dzielnice i zjednoczona.`,`30. Rozbicie dzielnicowe Polski — 166. 31. Polska w XIII wieku — 171. 32. Dążenie do jedności państwa — 176. 33. Zjednoczona Polska — 181. 34. Polska Kazimierza Wielkiego — 186.`,
    `VIII. Polska i Litwa.`,`35. Unia Polski z Litwą — 194. 36. Wielka wojna z zakonem krzyżackim — 199. 37. Synowie Jagiełły — 206. 38. Od rycerstwa do szlachty — 211. 39. Polska i Litwa w XV wieku — 218.`
  ]},
  {n:4,title:`Dzień dobry, Piątoklasistko i Piątoklasisto!`,p:[
    `Dzień dobry, Piątoklasistko i Piątoklasisto!`,`Mam nadzieję, że dobrze wypoczęliście podczas wakacji. I że stęskniliście się już za szkołą…`,
    `Akurat! To za mną się stęsknili!`,`A ja to pies? Żyć beze mnie nie mogą!`,
    `Histek, Napoleon, cisza! Jak zwykle przeszkadzają. Hm… O czym to ja mówiłem? Aha, że skończyły się wakacje, a z nimi wakacyjne wyjazdy i wędrówki. Nie szkodzi, zapraszam Was do nowej podróży – w czasie i przestrzeni.`,
    `Przeniesiemy się do starożytności, żeby zobaczyć, jak żyli dawni mieszkańcy Egiptu, Grecji, Rzymu i innych krajów. Potem wybierzemy się w czasy średniowiecza. Kiedy to było? Wyjaśnię na następnych stronach.`,
    `To co, gotowi do podróży? W takim razie…`,`Oj, byłbym zapomniał. Oczywiście poprowadzą nas niezastąpieni Histek i Napoleon.`,
    `I od razu książka robi się ciekawsza.`,`A już myślałem, że nie będzie o nas ani słowa.`,
    `Zaraz wejdą mi na głowę… Lepiej wyruszmy w naszą podróż. Szczęśliwej drogi!`,`Autor.`
  ]},
  {n:5,title:`Ruiny starożytnego teatru w Taorminie`,p:[`Ruiny starożytnego greckiego teatru w Taorminie na Sycylii, we Włoszech.`]},
  {n:6,title:`1. Czas w historii — kilka słów o chronologii`,p:[
    `1. Czas w historii.`,`W swojej prywatnej historii liczę lata od moich urodzin. Wszystko, co było wcześniej, wydarzyło się przed narodzeniem Histka.`,
    `Moim zdaniem przed narodzeniem Napoleona brzmi dużo lepiej.`,`Kilka słów o chronologii.`,
    `Chronologia to nauka, która zajmuje się: 1) mierzeniem czasu w przeszłości, 2) ustalaniem, co się wydarzyło najpierw, a co potem.`,
    `Lata liczymy od narodzenia Jezusa Chrystusa, czyli od 1 roku naszej ery – w skrócie n.e. Czasem mówi się też o 1 roku po Chrystusie – w skrócie po Chr. Następny był 2 r. n.e. itd. Słowo „rok” często skracamy – np. 64 r.`,
    `Jeśli coś się wydarzyło przed 1 rokiem naszej ery, mówimy, że było to przed naszą erą – w skrócie p.n.e. (albo przed Chrystusem – w skrócie przed Chr.). Spójrz na oś czasu: po 2 roku p.n.e. był 1 rok p.n.e., po nim 1 rok n.e. itd. Roku 0 nie było w ogóle.`,
    `Oś czasu: 2 rok p.n.e.; 1 rok p.n.e.; 1 rok n.e.; 2 rok n.e. Okres p.n.e. – przed Chrystusem. Okres n.e. – po Chrystusie.`,
    `Pełne sto lat nazywamy wiekiem lub stuleciem. Pierwszy wiek n.e. zaczął się w 1 roku n.e., a skończył w 100 roku n.e., drugi wiek n.e. trwał od 101 roku n.e. do 200 roku n.e. Wieki przed naszą erą liczymy od końca tak samo jak lata: drugi wiek p.n.e. to lata 200–101 p.n.e., pierwszy wiek p.n.e. – lata 100–1 p.n.e.`,
    `Wraz z upływem czasu pojawiały się coraz to nowe sposoby podróżowania – a także wyobrażenia o podróżach w przyszłości. Oto kilka przykładów.`,
    `Przejażdżka rydwanem, czyli dwukołowym wozem, na rzymskiej mozaice z III w. n.e.`,
    `Europejskie okręty na Oceanie Indyjskim. Rycina z XV w. Rycina to odbitka rysunku, zdjęcia, drzeworytu itp.`,
    `Start pierwszego w dziejach balonu na ogrzewane powietrze. Rycina z XVIII w.`
  ]},
  {n:7,title:`Czas w historii — wieki i tysiąclecia`,p:[
    `Wieki zapisujemy zwykle cyframi rzymskimi, a słowo „wiek” często skracamy, np. V w.`,
    `Wieki obliczamy tak: 776 rok p.n.e. → 7 + 1 = 8 → VIII wiek p.n.e. 1370 rok n.e. → 13 + 1 = 14 → XIV wiek n.e.`,
    `Ta reguła nie dotyczy lat, które mają na końcu dwa lub trzy zera. Nie dodajemy wówczas jedynki. Np. 1500 rok należał do XV wieku, a 2000 rok – do XX wieku.`,
    `Określając czas, mówimy też o połowach wieków. Np. pierwsza połowa II stulecia naszej ery to lata 101–150, a druga połowa to lata 151–200. Przed naszą erą połowy wieków liczymy odwrotnie: pierwsze jest to, co było wcześniej. Dlatego pierwsza połowa II wieku p.n.e. to lata 200–151, a druga połowa – lata 150–101.`,
    `Cyfry rzymskie: 1 – I, 2 – II, 3 – III, 4 – IV, 5 – V, 6 – VI, 7 – VII, 8 – VIII, 9 – IX, 10 – X, 11 – XI, 12 – XII, 13 – XIII, 14 – XIV, 15 – XV, 16 – XVI, 17 – XVII, 18 – XVIII, 19 – XIX, 20 – XX.`,
    `Połowy wieków: II wiek p.n.e. – pierwsza połowa 200–151, druga połowa 150–101; I wiek p.n.e. – pierwsza połowa 100–51, druga połowa 50–1; I wiek n.e. – pierwsza połowa 1–50, druga połowa 51–100; II wiek n.e. – pierwsza połowa 101–150, druga połowa 151–200.`,
    `Każde pełne tysiąc lat to tysiąclecie. Od 1 stycznia 2001 r. trwa trzecie tysiąclecie. Kiedy dobiegnie końca? Policz samodzielnie.`,
    `1. Co oznaczają skróty: r., w., n.e., p.n.e.?`,`2. Który rok był wcześniej: 87 p.n.e. czy 78 n.e.?`,
    `3. Który to wiek: 1800 r. p.n.e., 399 r. p.n.e., 64 r. n.e., 1001 r. n.e.?`,
    `Humorystyczne, to znaczy wesołe, wyobrażenie podróży przyszłości. Rysunek z 1829 r.`,
    `Pociąg Pendolino na stacji Warszawa Zachodnia. Zdjęcie z 2015 r.`
  ]},
  {n:8,title:`Prehistoria i historia`,p:[
    `Prehistoria i historia.`,`Naukowcy podzielili dzieje ludzkości na dwa wielkie okresy: prehistorię i historię.`,
    `Historia to dzieje ludzkości od wynalezienia pisma, czyli od ok. 3500 r. p.n.e.`,
    `Wszystko, co wydarzyło się w dziejach ludzkości przed wynalezieniem pisma, należy do prehistorii.`,
    `4. Czym się różni historia od prehistorii?`,
    `Prehistoryczne malowidło na ścianie jaskini w Lascaux, czytaj: lasko, we Francji. Przed wynalezieniem pisma ludzie malowali, żeby pokazać to, co było dla nich ważne.`,
    `Dzieje Ziemi można ukazać jako spiralę. Nasza planeta liczy sobie 4 miliardy 600 milionów lat, a początek spirali niknie gdzieś daleko. Pierwsze rośliny lądowe pojawiły się ok. 450 milionów lat temu, a ludzie rozumni – ok. 200 tysięcy lat temu. Gdyby dzieje Ziemi przedstawić jako 24 godziny, nasz gatunek istniałby 2 sekundy.`
  ]},
  {n:9,title:`Epoki historyczne i prehistoryczne`,p:[
    `Epoki historyczne i prehistoryczne.`,`Epoka to długi okres w historii lub prehistorii. Każda epoka ma początek i koniec oraz różni się od innych epok.`,
    `W prehistorii wyróżniamy dwie epoki: 1) starszą epokę kamienną, 2) młodszą epokę kamienną.`,
    `Nazwy obu epok pochodzą od kamiennych narzędzi, którymi posługiwali się ludzie.`,
    `Pierwszą epoką historyczną była starożytność. Zaczęła się razem z historią, czyli ok. 3500 r. p.n.e., kiedy ludzie wynaleźli pismo. Historycy przyjmują, że skończyła się w 476 r. n.e.`,
    `Po starożytności nastało średniowiecze. Trwało od 476 do 1492 r. Przy jego datach nie trzeba pisać n.e., gdyż wiadomo: jeśli średniowiecze zaczęło się w naszej erze, to nie mogło się skończyć przed naszą erą.`,
    `W 1492 r. średniowiecze dobiegło końca. Rozpoczęła się nowożytność, czyli epoka nowożytna, która trwa do dziś.`,
    `Ta gliniana tabliczka pochodzi z III tysiąclecia p.n.e. Są na niej wyryte znaki pisma Sumerów – najstarszego znanego nam pisma świata. O Sumerach przeczytasz na s. 18.`,
    `Schemat epok: starsza epoka kamienna; młodsza epoka kamienna; ok. 3500 r. p.n.e. – początek historii i starożytności; 476 r. n.e. – początek średniowiecza; 1492 r. – początek nowożytności.`,
    `Podział na epoki jest umowny. Historycy musieli przyjąć jakieś daty graniczne, więc przyjęli. Jednak możesz się natknąć na inne daty epok niż tu podane. Dlaczego? Ponieważ za koniec jednej epoki i początek następnej uważa się jakieś przełomowe wydarzenie, np. odkrycie Ameryki w 1492 r. Tyle że zdaniem niektórych historyków odkrycie Ameryki miało mniejsze znaczenie niż wynalazek druku w połowie XV w. Według nich właśnie wtedy zaczęła się epoka nowożytna.`,
    `Gdyby nie odkrrrycie Amerrryki, w ogóle byś o mnie nie wiedział.`,`No… Odkrycie ciebie to też początek nowej epoki.`,
    `5. Czym jest epoka?`,`6. Wymień epoki prehistoryczne i historyczne.`,`7. Co to znaczy, że podział na epoki jest umowny?`
  ]},
  {n:10,title:`I. Początki cywilizacji`,p:[
    `I. Początki cywilizacji.`,`2. Od myśliwych do rolników.`,`3. Cywilizacje Sumerów, doliny Indusu i Chin.`,
    `4. Starożytny Egipt.`,`5. Wierzenia starożytnych Egipcjan.`,`6. Starożytny Izrael.`,
    `Faraon Tutanchamon, z prawej, i jego żona. Egipska płaskorzeźba z XIV w. p.n.e.`
  ]},
  {n:11,title:`2. Od myśliwych do rolników — ludzie starszej epoki kamiennej`,p:[
    `2. Od myśliwych do rolników.`,
    `Oś czasu: ok. 198 tys. p.n.e. – pojawienie się człowieka rozumnego; ok. 38 tys. p.n.e. – przybycie ludzi rozumnych do Europy; ok. 18 tys. p.n.e. – początek ocieplania się klimatu; ok. 8000–ok. 2500 p.n.e. – młodsza epoka kamienna na Bliskim Wschodzie.`,
    `Ludzie starszej epoki kamiennej.`,
    `Człowiek rozumny, czyli taki jak my, pojawił się na Ziemi ok. 200 tysięcy lat temu. Właśnie tyle lat mają najstarsze odnalezione kości ludzi rozumnych.`,
    `Ok. 40 tysięcy lat temu ludzie przywędrowali do Europy. Na Ziemi trwał wtedy okres ochłodzenia. Średnia temperatura lipca na południu naszego kontynentu wynosiła +5 stopni Celsjusza! Północną część Europy pokrywał lądolód, którego grubość dochodziła do 3 kilometrów. Na południu ciągnęła się tundra, tzn. obszar porośnięty jedynie trawami, krzewami i pojedynczymi drzewami. Podobnie wyglądał Bliski Wschód, czyli południowo-zachodnia Azja i północno-wschodnia Afryka.`,
    `Ówcześni ludzie używali prostych narzędzi z kamienia, dlatego nazywamy ich ludźmi starszej epoki kamiennej albo paleolitu. Nie nauczyli się uprawiać ziemi, gdyż przez większą część roku była zmarznięta. Nie mogli budować drewnianych domów, ponieważ brakowało im budulca, lasy przecież nie rosły. Dlatego zajmowali się myślistwem i zbieractwem i prowadzili koczowniczy tryb życia, tzn. nie budowali trwałych domów, lecz wędrowali w poszukiwaniu żywności. Mieszkali w jaskiniach albo namiotach z kości mamuta okrytych zwierzęcymi skórami.`,
    `Przypomnij, co nazywamy prehistorią.`,`Lądolód – ogromna i bardzo gruba pokrywa lodowa.`,
    `1. Czym się różnił klimat Europy sprzed 40 tysięcy lat od dzisiejszego klimatu?`,
    `2. Dlaczego ludzie starszej epoki kamiennej prowadzili koczowniczy tryb życia?`,
    `Myśliwi paleolitu schwytali mamuta w dół-pułapkę. Rysunek z XX w.`
  ]},
  {n:12,title:`Infografika. Jak żyli ludzie starszej epoki kamiennej?`,p:[
    `Infografika. Jak żyli ludzie starszej epoki kamiennej?`,
    `Jaskinia była naturalnym schronieniem przed zimnem, wiatrem i dzikimi zwierzętami. Ludzie mieszkali w niej, dopóki nie wybili okolicznej zwierzyny. Gdy w oczy zaglądał im głód, ruszali dalej w poszukiwaniu pożywienia.`,
    `1. W gromadzie każdy miał swoje zadania. Te kobiety zajmują się przygotowaniem posiłku.`,
    `2. Ogień służył do ogrzewania jaskini i pieczenia mięsa, a nocą odstraszał dzikie zwierzęta.`
  ]},
  {n:13,title:`Infografika. Jak żyli ludzie starszej epoki kamiennej? — ciąg dalszy`,p:[
    `3. Zapora z kamieni utrudniała dostęp dzikim zwierzętom.`,
    `4. Ludzie nosili skórzane stroje z rękawami, a nawet kapturami. Do szycia służyła im igła z kości. Przez ucho przewlekali nić ze zwierzęcych ścięgien lub jelit.`,
    `5. W głębi jaskini ludzie grzebali swoich zmarłych. Do grobu wkładali im broń, ozdoby i inne przedmioty osobistego użytku.`,
    `Wyjaśnij, do jakich celów ludzie wykorzystywali jaskinię.`,`Wymień korzyści, które dawał ludziom ogień.`
  ]},
  {n:14,title:`Co jedli ludzie paleolitu? Rewolucja neolityczna`,p:[
    `Co jedli ludzie paleolitu?`,
    `Ludzie starszej epoki kamiennej żyli w gromadach. Taka gromada liczyła 20–30 osób. Mniejsza nie dałaby rady upolować dużego zwierzęcia, np. mamuta; w większej nie starczyłoby jedzenia dla wszystkich.`,
    `Myśliwi polowali przede wszystkim na mamuty, niedźwiedzie, byki, konie i renifery. Łowili też ryby, a kobiety i dzieci zbierały owoce, nasiona, jadalne korzenie oraz jaja ptaków.`,
    `Do wyrobu broni i narzędzi ludzie wykorzystywali krzemień. Jest to twarda skała, którą można łupać na kawałki o bardzo ostrych krawędziach. Myśliwi paleolitu wytwarzali toporki i oszczepy z krzemiennymi ostrzami.`,
    `Kilkanaście tysięcy lat temu ludzie wynaleźli łuk, który ułatwił polowanie na szybkie zwierzęta, takie jak renifery. Ich mięso można było upiec nad ogniskiem. Żeby rozpalić ogień, ludzie uderzali krzemieniem w kamień o nazwie piryt. Z pirytu sypały się iskry, które podpalały np. wiązkę suchej trawy.`,
    `Połów ryb za pomocą harpuna, tj. oszczepu z zadziorami na ostrzu i liną do przyciągnięcia zdobyczy. Rysunek z XXI w.`,
    `Krzemienny pięściak ze starszej epoki kamiennej, znaleziony w Anglii. Pięściaki służyły ludziom do rąbania, cięcia i kopania; były też używane jako broń.`,
    `W starszej epoce kamiennej ludzie udomowili psa.`,`A papugę?`,
    `3. Jakiej broni używali myśliwi paleolitu?`,`4. Co jedli ludzie starszej epoki kamiennej?`,`5. W jaki sposób ówcześni ludzie rozpalali ogień?`,
    `Rewolucja neolityczna.`,
    `Ok. 20 tysięcy lat temu klimat zaczął się ocieplać. Lądolód cofnął się powoli na północ. Zaczęły padać obfite deszcze. Na Bliskim Wschodzie, a potem w Europie wyrosły gęste lasy, wysokie trawy i dzikie zboża.`,
    `Ok. 10 tysięcy lat temu nastał okres ciepły, w którym żyjemy do dziś. Właśnie wtedy mieszkańcy Bliskiego Wschodu jako pierwsi ludzie w dziejach zaczęli uprawiać ziemię. Zajęli się też hodowlą zwierząt, by mieć pod dostatkiem mięsa, mleka, wełny i skór.`,
    `Uprawa ziemi i hodowla zwierząt to rolnictwo. Dawni myśliwi stali się pierwszymi rolnikami. Ulepszyli kamienne narzędzia, gdyż potrzebowali ich do karczowania lasów i pracy w polu.`,
    `Wszystkie te zmiany zapoczątkowały nową epokę, która nastała po paleolicie: młodszą epokę kamienną – albo neolit.`,
    `Karczować – usuwać drzewa z korzeniami.`
  ]},
  {n:15,title:`Rewolucja neolityczna — ciąg dalszy`,p:[
    `Neolit rozpoczął się ok. 8000 r. p.n.e. na Bliskim Wschodzie, gdzie trwał do ok. 2500 r. p.n.e. W innych częściach świata neolit zaczął się i skończył znacznie później.`,
    `Przejście ludzi od myślistwa i zbieractwa do rolnictwa nazywamy rewolucją neolityczną.`,
    `Neolityczna wieś. Z prawej kobieta tka na krośnie: przeplata poziomą nić przez pionowe nici obciążone ciężarkami, żeby były napięte. Druga kobieta miele ziarna: rozciera je kamieniem na mąkę, z której upiecze chleb lub placki. Mężczyzna na drabinie naprawia dach wiązkami słomy. Rysunek z XX w.`,
    `6. Gdzie i dlaczego ok. 10 tysięcy lat temu zmieniły się warunki życia ludzi?`,`7. Wyjaśnij, skąd pochodzi nazwa: młodsza epoka kamienna.`,`8. Co nazywamy rewolucją neolityczną?`,
    `Co zmieniła rewolucja neolityczna?`,`Skutki rewolucji neolitycznej odczuwamy do dziś. Oto najważniejsze:`,
    `1. Ludzie zaczęli prowadzić osiadły tryb życia. Nie wędrowali już z miejsca na miejsce, bo musieli doglądać pól. Budowali trwałe domy – z drewna albo z gliny zmieszanej z trzciną.`,
    `2. Udoskonalili kamienne narzędzia. Nauczyli się je wygładzać, przewiercać i osadzać na trzonkach. Zaczęli też wytwarzać narzędzia rolnicze.`,
    `3. Udomowili kozy, owce, bydło oraz świnie. Zwierzęta hodowlane oprócz mięsa i skór zapewniały mleko oraz wełnę.`,
    `4. Rolnictwo pozwalało wyżywić więcej ludzi niż myślistwo i zbieractwo, dlatego na Bliskim Wschodzie przybywało ludzi. Budowali oni coraz ludniejsze wsie i osady.`,
    `Tak przewiercano kamienne ostrze siekiery, żeby osadzić je na trzonku. „Wiertarką” był kij; pomocnik sypał do otworu piasek, który zwiększał tarcie. Rysunek z XXI w.`
  ]}
];

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(req.headers['x-import-key']!==process.env.HISTORY_IMPORT_SECRET) return res.status(401).json({error:'Unauthorized'});
  const written=[];
  try{
    for(const item of DATA){
      const id=String(item.n).padStart(3,'0');
      const data={
        bookId:'historia-5',
        sourcePage:item.n,
        title:item.title,
        text:item.p.join('\n\n'),
        paragraphs:item.p
      };
      const pathname=`books/historia-5/text/${id}.json`;
      await put(pathname,JSON.stringify(data),{
        access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'
      });
      written.push(pathname);
    }
    return res.status(200).json({ok:true,count:written.length,written});
  }catch(e){
    return res.status(500).json({error:String(e?.message||e),written});
  }
}
