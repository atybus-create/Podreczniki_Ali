import { put } from '@vercel/blob';
const KEY='geo-fix-022-20261111-C2p7';
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 if(String(req.query.key||'')!==KEY)return res.status(401).json({error:'Unauthorized'});
 const paragraphs=["Zanim zaczniesz... Odszukaj w atlasie geograficznym kilka map. Przeanalizuj ich treść i porównaj je ze sobą.","Mapy są ważnym źródłem informacji zarówno o najbliższej okolicy, jak i o całym świecie. W książkach, atlasach geograficznych oraz internecie można znaleźć wiele map przedstawiających różne elementy środowiska i rodzaje działalności człowieka. Mapy mogą zatem przedstawiać rozmaite treści.","Rodzaje map.","Ze względu na to, do jakich celów wykorzystujemy daną mapę, wyróżnia się między innymi mapy ogólnogeograficzne, mapy krajobrazowe, mapy turystyczne oraz plany miast.","Mapy ogólnogeograficzne przedstawiają podstawowe informacje o danym obszarze, takie jak: ukształtowanie powierzchni, największe rzeki i jeziora, najważniejsze miasta, drogi i granice państw.","Na mapach krajobrazowych przedstawia się przede wszystkim zagospodarowanie terenu, w tym pola uprawne, łąki, lasy, a także zabudowę miejską i przemysłową.","Na przykładzie mapy południowo-wschodniej Polski obie mapy wykonano w skali 1:6 000 000."];
 const body={bookId:'planeta-nowa-5',sourcePage:22,title:'4. Czytamy mapę najbliższej okolicy',text:paragraphs.join('\n\n'),paragraphs};
 await put('books/planeta-nowa-5/text/022.json',JSON.stringify(body),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});
 return res.status(200).json({ok:true,id:'022'});
}