
const cosmos = require("@azure/cosmos");
const CosmosClient = cosmos.CosmosClient;
//config voor users table
const config = require("./config");
const dbContext = require("../js/data/databaseContext.js");
//config voor frames table
const config2 = require("./config2");
const dbContext2 = require("../js/data/databaseContext2.js");
//config voor klanten table
const config3 = require("./config3");
const dbContext3 = require("../js/data/databaseContext3.js");

//config voor fastclick. Dit is momenteel niet meer ingebruik maar indien het probleem met click weer meerdere notifications stuurt kun je deze fastclick gebruiken ipv click
var attachFastClick = require('fastclick');
attachFastClick(document.body);

//functie om alle users van de database te verkrijgen
async function main() {
    let lijst = [];
    const {endpoint, key, databaseId, containerId} = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext.create(client, databaseId, containerId);

    try {
        const querySpec = {
            query: "SELECT * from c"
        };
        const {resources: items} = await container.items
            .query(querySpec)
            .fetchAll();
        for (const item of items) {
            tussenlijst = [];
            tussenlijst.push(`${item.usernaam}`);
            tussenlijst.push(`${item.wachtwoord}`);
            tussenlijst.push(`${item.userid}`);
            lijst.push(tussenlijst);
        }

        return lijst;


    } catch (err) {
        console.log(err.message);
    }
    // return lijst;
}


//-----------------------------------------------------------------------------------------------

//functie om alle frames te krijgen die er zijn
async function getframes() {
    let lijst = [];
    const {endpoint, key, databaseId, containerId} = config2;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext2.create(client, databaseId, containerId);

    try {
        const querySpec = {
            query: `SELECT distinct c.frameid from c`
        };

        const {resources: items} = await container.items
            .query(querySpec)
            .fetchAll();

        items.forEach(frame => {
            lijst.push(frame.frameid);
        });


        return lijst;

    } catch (err) {
        // console.log(err.message);
    }
}

//----------------------------------------------------------------------------------------
//functie om een user te deleten op basis van id en category
async function deleteuser(id,category){
    const {endpoint, key, databaseId, containerId} = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    await dbContext.create(client, databaseId, containerId);

    try {
        await container.item(`${id}`, `${category}`).delete();

    } catch (err) {
    }
}

//functie om alle users te krijgen met meer informatie
async function getusers4() {
    let lijst = [];
    const {endpoint, key, databaseId, containerId} = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext.create(client, databaseId, containerId);

    try {

        const queryData2 = {
            query: `SELECT * from c`
        };

        const {resources: datalines5} = await container.items
            .query(queryData2)
            .fetchAll();
        datalines5.forEach(data => {
            var framedatalist = [];
            framedatalist.push(`${data.userid}`);
            framedatalist.push(`${data.usernaam}`);
            framedatalist.push(`${data.naam}`);
            framedatalist.push(`${data.familienaam}`);
            framedatalist.push(`${data.id}`);
            framedatalist.push(`${data.wachtwoord}`);
            lijst.push(framedatalist);
        });


        return lijst;

    } catch (err) {
        // console.log(err.message);
    }
}
//----------------------------------------------------------------------------------------


async function getframesdata() {
    var frames = await getframes();
    let lijst = [];
    const {endpoint, key, databaseId, containerId} = config2;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext2.create(client, databaseId, containerId);

    try {
        // console.log('querying container: items');


        const forLoop = async _ => {

            for (o in frames) {
                var string = frames[o].toString();
                const queryData = {
                    query: `SELECT distinct top 1 c.frameid, c.datum, c.coordinaten, c.land, c.deelstaat, c.gewest, c.gemeente, c.postcode , c.straat, c.huisnummer from c where c.frameid = "${string}" order by c._ts desc`
                };
                const {resources: datalines5} = await container.items
                    .query(queryData)
                    .fetchAll();
                datalines5.forEach(data => {
                    var framedatalist = [];
                    framedatalist.push(`${data.frameid}`);
                    framedatalist.push(`${data.datum}`);
                    coordinaten = `${data.coordinaten}`;
                    coordinaten2 = coordinaten.split(",");
                    latitude = coordinaten2[0];
                    longtitude2 = coordinaten2[1];
                    framedatalist.push(latitude);
                    longti = longtitude2.replace(/\s+/g, '');
                    framedatalist.push(longti);
                    framedatalist.push(`${data.land}`);
                    framedatalist.push(`${data.deelstaat}`);
                    framedatalist.push(`${data.gewest}`);
                    framedatalist.push(`${data.gemeente}`);
                    framedatalist.push(`${data.postcode}`);
                    framedatalist.push(`${data.straat}`);
                    framedatalist.push(`${data.huisnummer}`);
                    lijst.push(framedatalist);
                });
            }
        }
        await forLoop();
        return lijst;
    } catch
        (err) {
        console.log(err.message);
    }
}


//getdata van de frames op basis van het frameid dit word gebruikt bij het search field waarbij je kunt zoeken op frameid
async function getdataonframeid(dataframe) {
    let lijst = [];
    const {endpoint, key, databaseId, containerId} = config2;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext2.create(client, databaseId, containerId);

    try {
        const queryData2 = {
            query: `SELECT distinct top 1 c.frameid, c.datum, c.coordinaten, c.land, c.deelstaat, c.gewest, c.gemeente, c.postcode , c.straat, c.huisnummer from c where c.frameid = "${dataframe}" order by c.datum asc`
        };

        const {resources: datalines5} = await container.items
            .query(queryData2)
            .fetchAll();
        datalines5.forEach(data => {
            var framedatalist = [];
            framedatalist.push(`${data.frameid}`);
            framedatalist.push(`${data.datum}`);
            coordinaten = `${data.coordinaten}`;
            coordinaten2 = coordinaten.split(",");
            latitude = coordinaten2[0];
            longtitude2 = coordinaten2[1];
            framedatalist.push(latitude);
            longti = longtitude2.replace(/\s+/g, '');
            framedatalist.push(longti);
            framedatalist.push(`${data.land}`);
            framedatalist.push(`${data.deelstaat}`);
            framedatalist.push(`${data.gewest}`);
            framedatalist.push(`${data.gemeente}`);
            framedatalist.push(`${data.postcode}`);
            framedatalist.push(`${data.straat}`);
            framedatalist.push(`${data.huisnummer}`);
            lijst.push(framedatalist);
        });


        return lijst;

    } catch (err) {
        // console.log(err.message);
    }
}



//functie om klanten aan te maken
async function klantenmaken(id,naam,familie,land,gemeente,postcode,straat,huisnummer,gsmnummer,frames) {
    const {endpoint, key, databaseId, containerId} = config3;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext3.create(client, databaseId, containerId);
    container.items.create({klantid: id, naam: naam, familienaam: familie, land: land, gemeente: gemeente, postcode: postcode, straat : straat, huisnummer:huisnummer, gsm : gsmnummer,frames:{frameid:frames} });
}

//functie om user aantemaken
async function usermaken(id,usernaam,naam,familienaam,wachtwoord) {
    const {endpoint, key, databaseId, containerId} = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext.create(client, databaseId, containerId);
    container.items.create({userid: id, usernaam: usernaam, naam: naam, familienaam: familienaam, wachtwoord: wachtwoord});
}
//functie om frame toetevoegen
async function framestoevoegen(klantenid,frameid) {
    const {endpoint, key, databaseId, containerId} = config3;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    try {

        const queryData2 = {
            query: `SELECT * from c where c.klantid = "${klantenid}"`
        };

        const { resources: items } = await container.items
            .query(queryData2)
            .fetchAll();
        items[0].frames.frameid = frameid;

        await container.item(`${items[0].id}`,`${items[0].klantid}`).replace(items[0]);
    } catch (err) {
    }
}

//klantadres editen
async function editklantadres(klantenid,straat,huisnummer,postcode,gemeente,land) {
    const {endpoint, key, databaseId, containerId} = config3;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    try {
        const queryData2 = {
            query: `SELECT * from c where c.klantid = "${klantenid}"`
        };

        const { resources: items } = await container.items
            .query(queryData2)
            .fetchAll();
        items[0].land = land;
        items[0].gemeente = gemeente;
        items[0].postcode = postcode;
        items[0].straat = straat;
        items[0].huisnummer = huisnummer;

        await container.item(`${items[0].id}`,`${items[0].klantid}`).replace(items[0]);
    } catch (err) {
        // console.log(err.message);
    }
}
//klant gsmnummer editen
async function editklantgsm(klantenid,gsmnummer) {
    const {endpoint, key, databaseId, containerId} = config3;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    try {
        const queryData2 = {
            query: `SELECT * from c where c.klantid = "${klantenid}"`
        };

        const { resources: items } = await container.items
            .query(queryData2)
            .fetchAll();
        items[0].gsm = gsmnummer;

        await container.item(`${items[0].id}`,`${items[0].klantid}`).replace(items[0]);
    } catch (err) {
    }
}
//editen van een user zijn wachtwoord
async function userediten(id,userid,wachtwoord) {
    const {endpoint, key, databaseId, containerId} = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    try {
        const queryData2 = {
            query: `SELECT * from c where c.userid = "${userid}"`
        };

        const { resources: items } = await container.items
            .query(queryData2)
            .fetchAll();
        items[0].wachtwoord = wachtwoord;

        await container.item(`${id}`,`${userid}`).replace(items[0]);
    } catch (err) {
    }
}

//laatste userid
async function lastuserid() {
    const {endpoint, key, databaseId, containerId} = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    var string;
    try {
        const queryData2 = {
            query: `SELECT top 1 c.userid from c order by c.userid desc`
        };

        const { resources: items } = await container.items
            .query(queryData2)
            .fetchAll();

        for(i in items){
            string = items[i];
        }
        return string;
    } catch (err) {
    }
}
//function om een land om te zetten naar een internationale code zodat een bericht kan verstuurd worden naar mensen in het buitenland etc
function landtocodegsm(land){
    countrycode="";
    if(land=="Albanië"){
        countrycode="+355";
    }
    if(land=="Andorra"){
        countrycode="+376";
    }
    if(land=="Armenië"){
        countrycode="+374";
    }
    if(land=="Azerbeidzjan"){
        countrycode="+994";
    }
    if (land=="België"){
        countrycode="+32";
    }
    if (land=="belgie"){
        countrycode="+32";
    }
    if (land=="Belgie"){
        countrycode="+32";
    }
    if (land=="belgië"){
        countrycode="+32";
    }
    if(land=="Bosnië en Herzegovina"){
        countrycode="+387";
    }
    if(land=="Bulgarije"){
        countrycode="+359";
    }
    if(land=="Cyprus"){
        countrycode="+357";
    }
    if(land=="Denemarken"){
        countrycode="+45";
    }
    if(land=="Duitsland"){
        countrycode="+49";
    }
    if(land=="Estland"){
        countrycode="+372";
    }
    if(land=="Finland"){
        countrycode="+358";
    }
    if(land=="Frankrijk"){
        countrycode="+33";
    }
    if(land=="Georgië"){
        countrycode="+995";
    }
    if(land=="Griekenland"){
        countrycode="+30";
    }
    if(land=="Hongarije"){
        countrycode="+36";
    }
    if(land=="Ierland"){
        countrycode="+353";
    }
    if(land=="IJsland"){
        countrycode="+354";
    }
    if(land=="Italië"){
        countrycode="+39";
    }
    if(land=="Kazachstan"){
        countrycode="+7";
    }
    if(land=="Kosovo"){
        countrycode="+383";
    }
    if(land=="Kroatië"){
        countrycode="+385";
    }
    if(land=="Letland"){
        countrycode="+856";
    }
    if(land=="Liechtenstein"){
        countrycode="+423";
    }
    if(land=="Litouwen"){
        countrycode="+370";
    }
    if(land=="Luxemburg"){
        countrycode="+352";
    }
    if(land=="Malta"){
        countrycode="+356";
    }
    if(land=="Moldavië"){
        countrycode="+373";
    }
    if(land=="Monaco"){
        countrycode="+377";
    }
    if(land=="Montenegro"){
        countrycode="+382";
    }
    if(land=="Nederland"){
        countrycode="+31";
    }
    if(land=="Noord-Macedonië"){
        countrycode="+389";
    }
    if(land=="Noorwegen"){
        countrycode="+47";
    }
    if(land=="Oekraïne"){
        countrycode="+380";
    }
    if(land=="Oostenrijk"){
        countrycode="+43";
    }
    if(land=="Polen"){
        countrycode="+48";
    }
    if(land=="Portugal"){
        countrycode="+351";
    }
    if(land=="Roemenië"){
        countrycode="+40";
    }
    if(land=="Rusland"){
        countrycode="+7";
    }
    if(land=="San Marino"){
        countrycode="+378";
    }
    if(land=="Servië"){
        countrycode="+381";
    }
    if(land=="Slovenië"){
        countrycode="+386";
    }
    if(land=="Slowakije"){
        countrycode="+421";
    }
    if(land=="Spanje"){
        countrycode="+34";
    }
    if(land=="Tsjechië"){
        countrycode="+420";
    }
    if(land=="Turkije"){
        countrycode="+90";
    }
    if(land=="Vaticaanstad"){
        countrycode="+379";
    }
    if(land=="Verenigd Koninkrijk"){
        countrycode="+44";
    }
    if(land=="Wit-Rusland"){
        countrycode="+375";
    }
    if(land=="Zweden"){
        countrycode="+46";
    }
    if(land=="Zwitserland"){
        countrycode="+41";
    }

    return countrycode;
}



//functie om alle klanten hun data te krijgen
async function getklanten() {
    let lijst = [];
    const {endpoint, key, databaseId, containerId} = config3;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext3.create(client, databaseId, containerId);

    try {
        // console.log('querying container: items');

        const querySpec = {
            query: `SELECT * from c`
        };

        const {resources: items} = await container.items
            .query(querySpec)
            .fetchAll();

        items.forEach(klant => {
            const tussenlijst=[];
            // console.log("printen van gegevens frameids");
            tussenlijst.push(`${klant.klantid}`);
            tussenlijst.push(`${klant.naam}`);
            tussenlijst.push(`${klant.familienaam}`);
            tussenlijst.push(`${klant.land}`);
            tussenlijst.push(`${klant.gemeente}`);
            tussenlijst.push(`${klant.postcode}`);
            tussenlijst.push(`${klant.straat}`);
            tussenlijst.push(`${klant.huisnummer}`);
            tussenlijst.push(`${klant.frames.frameid}`);
            tussenlijst.push(`${klant.gsm}`);
            tussenlijst.push(`${klant.id}`);
            // console.log(`${klant.frames.frameid}`);
            lijst.push(tussenlijst);
        });


        return lijst;

    } catch (err) {
        // console.log(err.message);
    }
}
//functie om klanten op een id te verkrijgen
async function getklantenonid2(dataframe) {
    let lijst = [];
    const {endpoint, key, databaseId, containerId} = config3;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
// //make sure database is already setup, else create it
    await dbContext3.create(client, databaseId, containerId);

    try {

        const queryData2 = {
            query: `SELECT * from c where c.klantid = "${dataframe}"`
        };

        const {resources: datalines5} = await container.items
            .query(queryData2)
            .fetchAll();
        datalines5.forEach(data => {
            var framedatalist = [];
            framedatalist.push(`${data.klantid}`);
            framedatalist.push(`${data.naam}`);
            framedatalist.push(`${data.familienaam}`);
            framedatalist.push(`${data.land}`);
            framedatalist.push(`${data.gemeente}`);
            framedatalist.push(`${data.postcode}`);
            framedatalist.push(`${data.straat}`);
            framedatalist.push(`${data.huisnummer}`);
            framedatalist.push(`${data.frames.frameid}`);
            framedatalist.push(`${data.gsm}`);
            framedatalist.push(`${data.id}`);
            lijst.push(framedatalist);
        });
        return lijst;

    } catch (err) {
    }
}




var ingelogged=0;
var allmarkers;
var useridloggedin;

//functie om de eerste letter van een string hoofdletter te maken.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//functie die niet meer gebruikt word op het moment, zou later gebruikt kunnen worden indien click meerdere notificaties geeft.
function eventHandler(event, selector) {
    event.stopPropagation(); // Stop event bubbling.
    event.preventDefault(); // Prevent default behaviour
    if (event.type === 'touchend') selector.off('click'); // If event type was touch turn off clicks to prevent phantom clicks.
}

//functie die ervoor zorgt dat .click niet meerdere keren een notificatie geeft. Dit lost het probleem slecht half op hiervoor hebben we gebruik gemaakt van on en off click
function cancelDuplicates(fn, threshhold, scope) {
    if (typeof threshhold !== 'number') threshhold = 10;
    var last = 0;

    return function () {
        var now = +new Date;

        if (now >= last + threshhold) {
            last = now;
            fn.apply(scope || this, arguments);
        }
    };
}



//wanneer er op users geklikt word
var usersdata = [];
$('#users').click( async function () {
    $('ul.collection').empty();
    //neem alle users
    usersdata = await getusers4();
    //voor elke user
    for (i in usersdata){
        //als je bent ingelogged
        //maak je een li aan met daarin een delete knop, informatie van de klant en een edit knop met telkens het id van de klant. deze li voeg je uiteindelijk toe aan de ul op html
        //wanneer de ingelogde user id 1 heeft dus de enige met admin rechten dan kun je iedereen editen
        if(useridloggedin== 1){
            let item = `<li class="collection-item avatar" data-task="${usersdata[i][0]}">             
            <i class="material-icons circle red deleteTask" data-task="${usersdata[i][0]}">delete_forever</i>
            <div data-task="test">
			<p>userid= ${usersdata[i][0]}</p>	
			<p>username= ${usersdata[i][1]}</p>		
			<p>naam= ${usersdata[i][2]}</p>
			<p>familienaam= ${usersdata[i][3]}</p>			
			</div>
            <i class="material-icons circle blue edituser" data-task="${usersdata[i][0]}">edit</i>
			</li>`;
            $('ul.collection').append(item);
        }
        //anders heb je geen admin rechten en kun je enkel jezelf editen
        else{
            //wannneer het jou profiel is toon je een edit button
            if (usersdata[i][0] == useridloggedin){
                let item = `<li class="collection-item avatar" data-task="${usersdata[i][0]}">
            <i class="material-icons circle red deleteTask" data-task="${usersdata[i][0]}">delete_forever</i>
            <div data-task="test" contenteditable>
			<p>userid= ${usersdata[i][0]}</p>
			<p>username= ${usersdata[i][1]}</p>
			<p>naam= ${usersdata[i][2]}</p>
			<p>familienaam= ${usersdata[i][3]}</p>
			</div>
            <i class="material-icons circle blue edituser" data-task="${usersdata[i][0]}">edit</i>
			</li>`;
                $('ul.collection').append(item);
            }

            //anders is het een andere user, hierbij is dus geen edit button
            else{
                let item = `<li class="collection-item avatar" data-task="${usersdata[i][0]}"> 
<!--            <i class="material-icons circle red deleteTask" data-task="${usersdata[i][0]}">delete_forever</i>-->
            <div data-task="test">
			<p>userid= ${usersdata[i][0]}</p>	
			<p>username= ${usersdata[i][1]}</p>		
			<p>naam= ${usersdata[i][2]}</p>
			<p>familienaam= ${usersdata[i][3]}</p>			
			</div>        
			</li>`;
                $('ul.collection').append(item);
            }
        }
    }

    //wanneer je om de delete knop drukt van een user
    $('ul').on('click', '.deleteTask',  async function(event) {
        //zorgt ervoor dat je niet meerdere malen de notificatie krijgt
        event.stopImmediatePropagation();
        var category = "";
        let id = $(this).data('task');   // id = waarde x uit data-task="x"
        for (i in usersdata) {
            if (usersdata[i][0] == id) {
                category = usersdata[i][4];
            }
        }
        //dit zijn de buttons die in de notifications zitten
        let buttons = ['Ja', 'Nee'];
        //notfication aanmaken
        navigator.notification.confirm("Weet je zeker dat je de user wilt verwijderen", onConfirm, "Ben je zeker?", buttons);
        //als de notificatie goed is uitgevoerd.
        async function onConfirm(buttonIndex) {
            if (buttonIndex ==1){
                //als er gedrukt word op ja, dan word de user verwijderd
                deleteuser(category, id);
                //als de user die verwijderd word het profiel is dat op het moment is ingelogged ga je naar de login pagina
                if (id == useridloggedin){
                    $('#tabInstelligen').show();
                    $('#tabshowuser').hide();
                }
                //anders word de pagina gerefreshed met de nieuwe data. Dit wilt zeggen dat de user dus niet meer getoond word en dus verwijderd is.
                else{
                    usersdata = await getusers4();
                    $('ul.collection').empty();
                    for (i in usersdata) {
                        if(useridloggedin== 1){
                            let item = `<li class="collection-item avatar" data-task="${usersdata[i][0]}">             
            <i class="material-icons circle red deleteTask" data-task="${usersdata[i][0]}">delete_forever</i>
            <div data-task="test" contenteditable>
			<p>userid= ${usersdata[i][0]}</p>	
			<p>username= ${usersdata[i][1]}</p>		
			<p>naam= ${usersdata[i][2]}</p>
			<p>familienaam= ${usersdata[i][3]}</p>			
			</div>
            <i class="material-icons circle blue edituser" data-task="${usersdata[i][0]}">edit</i>
			</li>`;
                            $('ul.collection').append(item);
                        }
                        else{
                            if (usersdata[i][0] == useridloggedin){
                                let item = `<li class="collection-item avatar" data-task="${usersdata[i][0]}">             
            <i class="material-icons circle red deleteTask" data-task="${usersdata[i][0]}">delete_forever</i>
            <div data-task="test" contenteditable>
			<p>userid= ${usersdata[i][0]}</p>	
			<p>username= ${usersdata[i][1]}</p>		
			<p>naam= ${usersdata[i][2]}</p>
			<p>familienaam= ${usersdata[i][3]}</p>			
			</div>
            <i class="material-icons circle blue edituser" data-task="${usersdata[i][0]}">edit</i>
			</li>`;
                                $('ul.collection').append(item);
                            }


                            else{
                                let item = `<li class="collection-item avatar" data-task="${usersdata[i][0]}"> 
            <i class="material-icons circle red deleteTask" data-task="${usersdata[i][0]}">delete_forever</i>
            <div data-task="test" contenteditable>
			<p>userid= ${usersdata[i][0]}</p>	
			<p>username= ${usersdata[i][1]}</p>		
			<p>naam= ${usersdata[i][2]}</p>
			<p>familienaam= ${usersdata[i][3]}</p>			
			</div>        
			</li>`;
                                $('ul.collection').append(item);
                            }
                        }
                    }
                }

            }
            $(this).off('click');
        }




    });
    //wanneer er op de knop editen gedrukt word
    $('ul').on('click', '.edituser',  async function(event) {
        //dit zorgt ervoor dat een notificatie niet meerdere malen getoond word.
        event.stopImmediatePropagation();
        var category = "";
        let id = $(this).data('task');   // id = waarde x uit data-task="x"
        var test = "";
        //voor elke user
        for (i in usersdata) {
            //zet je de waarde in de variable
            test = usersdata[i][5];
            if (usersdata[i][0] == id) {
                category = usersdata[i][4];
            }
        }
        //de buttons voor de notificatie
        let buttons = ['Change','Cancel'];
        //opstellen van de notificatie
        navigator.notification.prompt("Weet je zeker dat je het wachtwoord wilt veranderen?", onPrompt, "oud wachtwoord,nieuw wachtwoord,herhaal wachtwoord", buttons);



        //wanneer de notificatie goed is aangekomen
        async function onPrompt(buttonIndex){
            let inputtest = buttonIndex.input1.split(".");
            // console.log("test3" + inputtest[0],inputtest[1],inputtest[2]);
            // console.log("test4" + inputtest[0]);
            // console.log("test5" + test);
            //als het een admin profiel is kun je het wachtwoord aanpassen zonder het vorige passwoord te weten.
            if (useridloggedin==1){
                userediten(category,id,inputtest[2]);
                M.toast({html: 'Wachtwoord is aangepast', displayLength: 3000, classes: 'green rounded center'});
            }
            //anders is het geen admin en moet hij dus het vorige wachtwoord weten
            else{
                if (inputtest[0] == test){
                    //als er op de knop change gedrukt word
                    if (buttonIndex.buttonIndex == 1){
                        //en het oude wachtwoord overeenkomt met de gekende data en de nieuwe wachtwoorden overeenkomen
                        if ((inputtest[1] == inputtest[2])&&(inputtest[0]!==undefined)){
                            userediten(category,id,inputtest[2]);
                            M.toast({html: 'Wachtwoord is aangepast', displayLength: 3000, classes: 'green rounded center'});
                            usersdata = await getusers4();
                        }
                        //anders is het oude wachtwoord fout, of het nieuwe en het herhaalde wachtwoord niet hetzelfde
                        else{
                            M.toast({html: 'Wachtwoorden komen niet overeen', displayLength: 3000, classes: 'red rounded center'});
                        }
                    }
                }
                else{
                    M.toast({html: 'Wachtwoord komen niet overeen!', displayLength: 3000, classes: 'red rounded center'});
                }
            }
        }
        //zorgt ervoor dat er geen meerdere notificaties komen
        $(this).off('click');
    });
});


// knop login pagina
$('#submitbutton').click(async function () {
    //input field
    subscribeKey = $('#password').val();
    publishKey = $('#username').val();
    //maak username 1ste letter hoofdletter
    publishKey = capitalizeFirstLetter(publishKey);
    //vraagt data op
    let data = await main();
    // console.log(data);
    let login;
    //voor elke gebruiker
    for (i in data) {
        username = data[i][0];
        wachtwoord = data[i][1];
        //als het wachtwoord en user overeenkomt
        if ((publishKey == username) && (subscribeKey == wachtwoord)) {
            login = "goed";
            useridloggedin = data[i][2];
        }
    }
    //je word ingelogged
    if (login == "goed") {
        $('#username').val("").empty();
        $('#password').val("").empty();
        ingelogged=1;
        frames = await getframes();
        M.toast({html: 'Je bent ingelogd', displayLength: 3000, classes: 'green rounded center'});
        $('#tabTutorial').show();
        $('#tabInstelligen').hide();


        $('.sidenav-trigger').show();
        history.pushState({}, null, "#dashboard");

        //toont de map op de basis locatie midden belgie
        var div = document.getElementById("map_canvas");
// Create a Google Maps native view under the map_canvas div.
        var map = plugin.google.maps.Map.getMap(div);
        map.animateCamera({
            target: {lat: 50.64022, lng: 4.66667},
            zoom: 5,
            tilt: 0,
            bearing: 0,
            duration: 5000
        });
    }
    //anders word ingelogged er is iets fout
    else {
        // console.log("fout");
        $('#tabInstelligen').show();

        M.toast({html: 'Wachtwoord of username ongeldig', displayLength: 3000, classes: 'red rounded center'});
    }
});

//wanneer er op logout geclicked word
$('#logout').click(async function () {
    ingelogged=0;
});

//code voor de map
document.addEventListener("deviceready", async function () {
    var allmarkers = [];
    let aantallist;
    const database2 = await getframesdata();

// If you click the button, do something...
    var button = document.getElementById("button");
    //als erop de button gedrukt word
    button.addEventListener("click", function () {
        //en je bent ingelogged toon alle frames op de map met behulp van markers
        if (ingelogged==1) {
            //test
            var div = document.getElementById("map_canvas");
// Create a Google Maps native view under the map_canvas div.
            var map = plugin.google.maps.Map.getMap(div);

            //maak een list van alle markers
            markers = [];

            // Move to the position with animation
            map.animateCamera({
                target: {lat: 50.64022, lng: 4.66667},
                zoom: 7,
                tilt: 0,
                bearing: 0,
                duration: 2500
            });

            // Add markers to list
            for (k in database2) {
                //maken van een marker
                var marker = map.addMarker({
                    position: {lat: database2[k][2], lng: database2[k][3]},
                    title: "Frameid: " + database2[k][0],
                    // snippet: database[i][4] + ", " + database[i][5] + ", " + database[i][6] + ", " + database[i][7] + ", " + database[i][8] + ", " + database[i][9] + ", " + database[i][10],
                    snippet: database2[k][1] + ", " + database2[k][4] + ", " + database2[k][5] + ", " + database2[k][6] + ", " + database2[k][7] + ", " + database2[k][8] + ", " + database2[k][9]+ ", " + database2[k][10],
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        size:{
                            width : 32,
                            height : 32
                        }
                    },
                    animation: plugin.google.maps.Animation.BOUNCE
                });
                markers.push(marker);
                //allmarkers word later gebruikt om alle markers van de map te kunnen verwijderen
                allmarkers.push(marker);
            }

            //voor elke marker toon de informatie op de kaart
            for (e in markers) {
                markers[e].showInfoWindow();

            }

        }
        //als je niet bent ingelogged geweest, ga terug naar de login pagina
        else{
            $('#tabTutorial').hide();
            $('#tabInstelligen').show();
        }
    });
    //wanneer er op de button geclicked word om alle frames te verwijderen
    var button4 = document.getElementById("button4");
    button4.addEventListener("click",function () {
        var div = document.getElementById("map_canvas");
// Create a Google Maps native view under the map_canvas div.
        var map = plugin.google.maps.Map.getMap(div);
        //elke marker uit allmarkers worden eruit gehaald
        for(i in allmarkers){
            if (allmarkers[i] !== undefined){
                allmarkers[i].remove();
                // console.log("allmarkers" + allmarkers[i]);
            }
        }
        //map word weer gecentreerd op belgië
        map.animateCamera({
            target: {lat: 50.64022, lng: 4.66667},
            zoom: 7,
            tilt: 0,
            bearing: 0,
            duration: 2500
        });
    });

    //als er op de button gedrukt word na een frameid in te geven

    var button2 = document.getElementById("button2");
    button2.addEventListener("click", function () {
        //en je bent ingelogged
        if (ingelogged==1) {
            var div = document.getElementById("map_canvas");
// Create a Google Maps native view under the map_canvas div.
            var map = plugin.google.maps.Map.getMap(div);
            markers2 = [];
            //vraag frameid op die gewild is (ingegeven is).
            wantedframeid = $('#frameid').val();
            // console.log(wantedframeid);
            getal = 0;
            //ga door de lijst
            for (i in database2) {
                //als het frameid het gewilde frameid is, maak je een marker aan met een andere kleur
                if (database2[i][0] == wantedframeid) {
                    getal = 1;
                    // console.log("gevonden");
                    // console.log(database2[i][0]);

                    map.animateCamera({
                        target: {lat: database2[i][2], lng: database2[i][3]},
                        zoom: 17,
                        tilt: 0,
                        bearing: 0,
                        duration: 3000
                    });

                    // Add a maker
                    var marker = map.addMarker({
                        position: {lat: database2[i][2], lng: database2[i][3]},
                        title: "Frameid: " + database2[i][0],
                        // snippet: database[i][4] + ", " + database[i][5] + ", " + database[i][6] + ", " + database[i][7] + ", " + database[i][8] + ", " + database[i][9] + ", " + database[i][10],
                        snippet: database2[i][1] + ", " +database2[i][4] + ", " + database2[i][5] + ", " + database2[i][6] + ", " + database2[i][7] + ", " + database2[i][8] + ", " + database2[i][9]+ ", " + database2[i][10],
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                            size:{
                                width : 32,
                                height : 32
                            }
                        },
                        animation: plugin.google.maps.Animation.BOUNCE
                    });
                    // Show the info window
                    marker.showInfoWindow();
                    allmarkers.push(marker);
                    $('#frameid').val("").empty();
                }
            }

            //als het frameid niet bestaat toon een melding dat deze niet bestaat.
            if (getal < 1) {
                M.toast({
                    html: 'Geen frame met frameid: ' + wantedframeid,
                    displayLength: 3000,
                    classes: 'red rounded center'
                });
                // console.log("geen frames gevonden")
            }
        }
        //als je niet bent ingelogged ga terug naar inlog pagina
        else {
            $('#tabBeneden').hide();
            $('#tabInstelligen').show();
        }
        // Move to the position with animation
    });
    //als er op de button gedrukt word om een user aan te maken

    var klantframesbutton = document.createElement("button");
    $('#submitbuttonusermaken').unbind().click(async function (event) {
        //zorgt ervoor dat je niet meerdere malen de notificatie krijgt
        event.stopImmediatePropagation();
        //als je bent ingelogged
        if (ingelogged == 1) {
            lijst = await main();
            var count = 0;

            lastuser = await lastuserid();
            for (i in lastuser){
                count = lastuser[i];
            }
            countint = parseInt(count);

            //aantal users + 1
            userid = countint + 1;
            //userid omzetten van int naar string
            userid2 = userid.toString();
            //opvragen van de data die is ingegeven
            usernaam = $('#usernaamuser').val();
            naam = $('#naamuser').val();
            familie = $('#familienaamuser').val();
            password = $('#passworduser').val();
            passwordconfirm = $('#passworduserconfirm').val();

            //maakt hoofdeletters van de eerste letters
            naam = capitalizeFirstLetter(naam);
            familie = capitalizeFirstLetter(familie);
            usernaam = capitalizeFirstLetter(usernaam);
            var check = "0";

            //als de data niet leeg is en je bent ingelogged
            if ((usernaam !== "") && (naam !== "") && (familie !== "") && (password !== "") && ingelogged == 1) {
                //kijk of de password nieuw en password confirm
                if (password == passwordconfirm) {
                    check = "1";
                }
                //als dit juist is
                if (check == "1") {
                    //maak de user aan
                    await usermaken(userid2, usernaam, naam, familie, password);
                    M.toast({
                        html: 'User is aangemaakt!',
                        displayLength: 3000,
                        classes: 'green rounded center'
                    });
                    //maakt inputfield leeg
                    $('#naamuser').val("").empty();
                    $('#familienaamuser').val("").empty();
                    $('#usernaamuser').val("").empty();
                    $('#passworduser').val("").empty();
                    $('#passworduserconfirm').val("").empty();
                }
                //als de wachtwoorden niet overeen komen, zet een melding
                else {
                    M.toast({
                        html: 'Wachtwoorden komen niet overeen!',
                        displayLength: 3000,
                        classes: 'red rounded center'
                    });
                }

        }
            //als je enkele velden leeg hebt gelaten met een *
            else {
            M.toast({html: 'Vul alle gegevens in met een *',
                displayLength: 3000,
                classes: 'red rounded center'
            });
        }
    }
        //als je niet ingelogged bent ga terug naar de login pagina
        else {
            $('#tabmakeuser').hide();
            $('#tabInstelligen').show();
        }

    });

    //als er op de klantmaken gedrukt word
    $('#submitbuttonklantmaken').click(async function () {
        //en je bent ingelogged
        if (ingelogged == 1){
            //opvragen alle klanten
            lijst= await getklanten();
            var count = 0;
            //voor elke klant die het getal +1
            for(i in lijst) {
                count++;
            }

            //vraag de gegevens op van de nieuwe klant

            klantenid = count+1;
            naam = $('#naam2').val();
            familie = $('#familienaam2').val();
            land = $('#land2').val();
            gemeente = $('#gemeente2').val();
            postcode = $('#postcode2').val();
            straat = $('#straat2').val();
            huisnummer = $('#huisnummer2').val();
            gsmnummer = $('#gsm').val();
            frames = $('#frames2').val();
            //maak hiervan hoofdletter indien dit niet gebeurt is
            naam = capitalizeFirstLetter(naam);
            familie = capitalizeFirstLetter(familie);
            land = capitalizeFirstLetter(land);
            gemeente = capitalizeFirstLetter(gemeente);
            straat = capitalizeFirstLetter(straat);

            countrycode = landtocodegsm(land);
            //indien de gsm nummer geen + in het input field heeft zet de het land om naar een europese gsm code en plak dit voor het nummer en verwijder het 1 ste ingegeven nummer
            var europegsm="";
            if(gsmnummer.includes("+")){
                europegsm=gsmnummer;
            }
            else{
                gsmnummersplit = gsmnummer.substring(1);
                europegsm=countrycode + gsmnummersplit;
                // console.log(gsmnummersplit);
                // console.log("gsmnummer heeft geen +");
            }
            //zet klantenid van int naar string
            klantenid2=klantenid.toString();

            //als er geen lege velden zijn en je bent ingelogged, maak klant aan
            if ((naam!="")&&(familie!="")&&(land!="")&&(gemeente!="")&&(postcode!="")&&(straat!="")&&(huisnummer!="")&&(gsmnummer!="")&&ingelogged==1){
                klantenmaken(klantenid2,naam,familie,land,gemeente,postcode,straat,huisnummer,europegsm,frames);
                M.toast({html: 'klant is aangemaakt', displayLength: 3000, classes: 'green rounded center'});
                $('#naam2').val("").empty();
                $('#familienaam2').val("").empty();
                $('#land2').val("").empty();
                $('#gemeente2').val("").empty();
                $('#postcode2').val("").empty();
                $('#straat2').val("").empty();
                $('#huisnummer2').val("").empty();
                $('#gsm').val("").empty();
                $('#frames2').val("").empty();
            }
            //anders komt er een notificatie dat je alle gegevens met een * moet invullen
            else {
                M.toast({html: 'Vul alle gegevens in met een *', displayLength: 3000, classes: 'red rounded center'});
            }
        }
        //als je niet bent ingelogged ga terug naar login pagina

        else {
            $('#tabmakeklant').hide();
            $('#tabInstelligen').show();
        }

    });


    klant=[];


var aantalklantengevonden;
    //wanneer er op de sidenav gedrukt word reset count
    $('.sidenav a').click(function () {
        aantalklantengevonden = 0;
    });

    //als er op de knop gedrukt word
    $('#submitbutton2').click(async function () {
        aantalklantengevonden=0;
        $('#frametoevoegen').val("").empty();
        $('#username').val("").empty();
        $('#password').val("").empty();
        var codegsm;


        //als je bent ingelogged
        if (ingelogged == 1) {
            aantallist =[];
            var div = document.getElementById("map_canvas");
// Create a Google Maps native view under the map_canvas div.
            var map = plugin.google.maps.Map.getMap(div);
            //reset html tekst
            $('#searchtest').html("");
            const klantendatalist = await getklanten();
            // ga kijken welke data er bruikbaar is
            naam = $('#naam').val();
            if (naam != null){
                bruikbarenaam = capitalizeFirstLetter(naam);
            }
            familie = $('#familienaam').val();
            if (familie != null){
                bruikbarefamilie = capitalizeFirstLetter(familie);
            }
            klantenid = $('#klantenid').val();
            if (klantenid != null){
                bruikbareklantenid = klantenid;
            }
            land = $('#land').val();
            if (land != null){
                bruikbareland = capitalizeFirstLetter(land);
            }
            postcode = $('#postcode').val();
            if (postcode != null){
                bruikbarepostcode = postcode;
            }
            straat = $('#straat').val();
            if (straat != null){
                bruikbarestraat = capitalizeFirstLetter(straat);
            }
            huisnummer = $('#huisnummer').val();
            if (huisnummer != null){
                bruikbarehuisnummer = huisnummer;
            }
            gemeente = $('#gemeente').val();
            if (gemeente!= null){
                bruikbaregemeente = capitalizeFirstLetter(gemeente);
            }



            var klanten = [];
            //ga kijken welke klanten hier bij kunnen passen
            for (i in klantendatalist) {
                if ((klantendatalist[i][0].includes(bruikbareklantenid)) && (klantendatalist[i][1].includes(bruikbarenaam)) && (klantendatalist[i][2].includes(bruikbarefamilie))&& (klantendatalist[i][3].includes(bruikbareland))&& (klantendatalist[i][4].includes(bruikbaregemeente))&& (klantendatalist[i][5].includes(bruikbarepostcode))&& (klantendatalist[i][6].includes(bruikbarestraat))&& (klantendatalist[i][7].includes(bruikbarehuisnummer))){
                    // console.log(klantendatalist[i]);
                    klanten.push(klantendatalist[i]);
                    klant.push(klantendatalist[i]);
                }
            }

            var gsmnummer;


            //voor elke klant dat overeen komt met de inputfield gegevens doe getal +1
            for (i in klanten){
                aantalklantengevonden++;
            }
            //als het getal 0 is en er dus geen klanten zijn, geef een melding dat er geen klanten zijn gevonden met deze input gegevens

            if (aantalklantengevonden==0){
                M.toast({html: 'Geen klanten gevonden', displayLength: 3000, classes: 'red rounded center'});
            }
            //als het aantal groter is dan 1, dan zijn er meerdere gevonden, hierbij gaan we een lijst aanvullen met alle mogelijke klanten en een knop om deze klant zijn gegevens te zien
            else if (aantalklantengevonden>1){
                var stringklanten = "";
                var stringklanten2 = "";
                var count=0;
                var items= "";
                for (i in klanten){
                    count++;
                    stringklanten = stringklanten+" "+klanten[i][0] +". "+ klanten[i][1] + " "+ klanten[i][2];
                    stringklanten2 = stringklanten2+" "+ klanten[i][0] +". "+ klanten[i][1] + " "+ klanten[i][2]+" "+ klanten[i][4]+" "+ klanten[i][5]+" "+ klanten[i][6]+" "+ klanten[i][7]+" "+'<br>';
                    var stringklanten3 = klanten[i][0] +". "+ klanten[i][1] + " "+ klanten[i][2]+" "+ klanten[i][4]+" "+ klanten[i][5]+" "+ klanten[i][6]+" "+ klanten[i][7];

                    let item = `<div class="border row">
                            <div class="col s9">
                                <p>${stringklanten3}</p>
                            </div>
                            <div class="col s3 gotoklant">
                                <i class="material-icons circle blue gotoklant2" data-task="${klanten[i][0]}">arrow_forward</i>
                            </div>			            	
			        </div>`;
                    items=items+item;
                }

                let items2=`<div class="margintop">${items}</div>`;



                $('#searchtest').html(items2);
                //als er geklickt word op de specifieke klant, ga je door dezelfde code dan er er maar 1 klant gevonden zou zijn
                $('.gotoklant').on('click', '.gotoklant2', cancelDuplicates( async function(event) {
                    items2="";
                    aantallist=[];
                    $('#searchtest').html(items2);
                    // console.log("geklikt");
                    var id = $(this).data('task');
                    idint = parseInt(id);
                    // console.log(id);
                    data = await getklantenonid2(idint);
                    // console.log(data);
                    klanten=data;
                    //    hier
                    $('#tabBoven').show();
                    $('#tabBeneden').hide();
                    // console.log(klanten[i]);
                    var codegsm;
                    var dataklantid;
                    var datanaam;
                    var datafamilienaam;
                    var dataland;
                    var datagemeente;
                    var datapostcode;
                    var datastraat;
                    var datahuisnummer;
                    var dataframeid;
                    var gsmnummer;
                    for (i in klanten) {
                        dataklantid = klanten[i][0];
                        datanaam = klanten[i][1];
                        datafamilienaam = klanten[i][2];
                        dataland = klanten[i][3];
                        datagemeente = klanten[i][4];
                        datapostcode = klanten[i][5];
                        datastraat = klanten[i][6];
                        datahuisnummer = klanten[i][7];
                        dataframeid = klanten[i][8];
                        gsmnummer = klanten[i][9];
                        aantallist = dataframeid.split(".");
                    }
                    items2="";
                    $('#searchtest').html(items2);

                    $('#naam').val("").empty();
                    $('#klantenid').val("").empty();
                    $('#gemeente').val("").empty();
                    $('#familienaam').val("").empty();
                    $('#land').val("").empty();
                    $('#postcode').val("").empty();
                    $('#straat').val("").empty();
                    $('#huisnummer').val("").empty();
                    var aantal = 0;

                    for (i in aantallist) {
                        aantal++;
                    }
                    if ((dataframeid == "null")||(dataframeid =="")) {
                        aantal=0;
                    }


                    const adres = datastraat + " " + datahuisnummer + ",<br>" + datapostcode + " " + datagemeente +",<br>" + dataland;
                    const adres2 = datastraat + "," + datahuisnummer + "," + datapostcode + "," + datagemeente+","+dataland;

                    //hide alle frames
                    $('#0frames').hide();
                    $('#1frames').hide();
                    $('#2frames').hide();
                    $('#3frames').hide();
                    $('#4frames').hide();
                    $('#5frames').hide();
                    //als er 1 frame is
                    if ((aantal == 1) && (aantallist[0] != "undefined")) {
                        $('#0frames').show();
                        $('#1frames').show();
                        $('#dataklantenframesid1').html(aantallist[0]);
                    }
                    //als er 2 frames zijn
                    if (aantal == 2) {
                        $('#0frames').show();
                        $('#1frames').show();
                        $('#2frames').show();
                        $('#dataklantenframesid1').html(aantallist[0]);
                        $('#dataklantenframesid2').html(aantallist[1]);
                    }
                    //als er 3 frames zijn
                    if (aantal == 3) {
                        $('#0frames').show();
                        $('#1frames').show();
                        $('#2frames').show();
                        $('#3frames').show();
                        $('#dataklantenframesid1').html(aantallist[0]);
                        $('#dataklantenframesid2').html(aantallist[1]);
                        $('#dataklantenframesid3').html(aantallist[2]);
                    }
                    //als er 4 frames zijn
                    if (aantal == 4) {
                        $('#0frames').show();
                        $('#1frames').show();
                        $('#4frames').show();
                        $('#2frames').show();
                        $('#3frames').show();
                        $('#dataklantenframesid1').html(aantallist[0]);
                        $('#dataklantenframesid2').html(aantallist[1]);
                        $('#dataklantenframesid3').html(aantallist[2]);
                        $('#dataklantenframesid4').html(aantallist[3]);
                    }
                    //als er 5 frames zijn
                    if (aantal == 5) {
                        $('#0frames').show();
                        $('#1frames').show();
                        $('#4frames').show();
                        $('#2frames').show();
                        $('#3frames').show();
                        $('#5frames').show();
                        $('#dataklantenframesid1').html(aantallist[0]);
                        $('#dataklantenframesid2').html(aantallist[1]);
                        $('#dataklantenframesid3').html(aantallist[2]);
                        $('#dataklantenframesid4').html(aantallist[3]);
                        $('#dataklantenframesid5').html(aantallist[4]);
                    }
                    //anders toon ze allemaal op 1 string aangezien dit niet normaal zou zijn
                    if (aantal > 5) {
                        $('#0frames').show();
                        $('#1frames').show();
                        $('#dataklantenframesid1').html(aantallist);
                    }

                    dataframes = aantal;


                    if (dataframeid == "undefined") {
                        dataframes = "0";
                    }
                    codegsm =landtocodegsm(dataland);
                    $('#dataklantenid').html(dataklantid);
                    $('#dataklantennaam').html(datanaam);
                    $('#dataklantenfamilie').html(datafamilienaam);
                    $('#dataklantenland').html(dataland);
                    $('#dataklantengemeente').html(datagemeente);
                    $('#dataklantenpostcode').html(datapostcode);
                    $('#dataklantenstraat').html(datastraat);
                    $('#dataklantenhuisnummer').html(datahuisnummer);
                    $('#dataklantenframes').html(dataframes);
                    $('#dataklantengsm').html(gsmnummer);
                    if (dataframes > 0) {
                        $('#dataklantenframesid').html(aantallist);
                    }
                    $('#dataklantenadres').html(`${adres}`);
                    var body = document.getElementById("framestonen");

                    //als het aantal groter is dan 1, string word meervoud
                    if (aantal > 1) {
                        klantframesbutton.textContent = "Frames tonen";
                    }
                    //anders string word enkelvoud, als er geen frames zijn word de string niet getoond
                    else {
                        klantframesbutton.textContent = "Frame tonen";
                    }

                    klantframesbutton.classList.add("buttonclass");

                    //als je op de editadres button drukt
                    $('#editadres').click( async function (event) {
                        //zorgt ervoor dat de notificatie niet meerdere malen getoond word
                        event.stopImmediatePropagation();
                        //aanmaken van volgende buttons
                        let buttons = ['Change','Cancel'];
                        //notificitation aanmaken
                        navigator.notification.prompt("Weet je zeker dat je het adres wilt veranderen?", onPrompt, `${adres2}`, buttons);
                        //als de notificatie goed is ingevuld
                        async function onPrompt(buttonIndex){
                            //zorgt ervoor dat er niet meerdere malen een notificatie getoond word
                            event.stopImmediatePropagation();
                            //als er op change gedrukt word
                            if (buttonIndex.buttonIndex == 1){
                                let inputtest = buttonIndex.input1.split(".");
                                codegsm =landtocodegsm(inputtest[4]);
                                // console.log(klanten[0][10]);
                                await editklantadres(klanten[0][0],inputtest[0],inputtest[1],inputtest[2],inputtest[3],inputtest[4]);

                                const adres = inputtest[0] + " " + inputtest[1] + ",<br>" + inputtest[2] + " " + inputtest[3] +",<br>" + inputtest[4];
                                $('#dataklantenadres').html(`${adres}`);
                            }

                        }
                        // console.log("er is geklikt");
                    });

                    //als er op edit gsm gedrukt word
                    $('#editgsm').click( async function (event) {
                        //zorgt ervoor dat je de notificatie niet meerdere keren krijgt
                        event.stopImmediatePropagation();
                        //aanmaken van buttons
                        let buttons = ['Change','Cancel'];
                        //aanmaken van notificatie
                        navigator.notification.prompt("Weet je zeker dat je de gsm-nummer wilt veranderen?", onPrompt, `${gsmnummer}`, buttons);
                        //als de notficatie succesvol is ingevult
                        async function onPrompt(buttonIndex){
                            //zorgt ervoor dat de notificatie niet meerdere keren getoond word
                            event.stopImmediatePropagation();
                            //als er gedrukt word op change
                            if(buttonIndex.buttonIndex == 1){
                                let inputtest = buttonIndex.input1;
                                // als er een + in de gsmnummer zit doe je niks
                                if (inputtest.includes("+")){
                                    gsmnummer=inputtest;
                                }
                                //anders ga je op basis van het land de gsm nummer internationaal maken
                                else{
                                    gsmnummer=codegsm + inputtest.substring(1);
                                    // console.log(gsmnummer);
                                }
                                // console.log("test1" + typeof (`${dataklantid}`));
                                // console.log(`${dataklantid}`);
                                await editklantgsm(`${dataklantid}`,gsmnummer);

                                $('#dataklantengsm').html(gsmnummer);
                            }

                        }

                    });


                    //wanneer er op de knop gedrukt word om de frames te editen

                    $('#submitbuttoneditframes').click(async function () {

                        var error=0;
                        var errorlist= [];
                        var errorklant = [];
                        var errortekst = "";
                        var klanten = await getklanten();
                        //vraag data op
                        var frameiddmwt = $('#frametoevoegen').val();
                        //gewilde frames zijn gesplisd opbasis van een .
                        gewildeframes = frameiddmwt.split(".");
                        for (i in klanten){
                            for (k in gewildeframes) {
                                if (klanten[i][8] == gewildeframes[k]) {
                                    error = 1;
                                    errorlist.push(gewildeframes[k]);
                                    errorklant.push(klanten[i]);
                                    errortekst = klanten[i][1] + " " + klanten[i][2] + " met userid:" + klanten[i][0] + " heeft frameid " + klanten[i][8];

                                }
                            }

                        }

                        //als de user een frameid wilt toevoegen aan een klant en deze frameid heeft iemand anders al, toon een notification en toon de klanten met deze frameid's
                        if (error == 1) {
                            $('#errors').html(errortekst);
                            M.toast({html: `Niet mogelijk om de frameid('s) te veranderen!`, displayLength: 3000, classes: 'red rounded center'});
                        }
                        // pas de frames aan
                        else{
                            //maak het field leef
                            $('#frametoevoegen').empty();
                            //maakt de errors html leeg
                            $('#errors').html(" ");
                            await framestoevoegen(dataklantid, frameiddmwt);
                            //notification dat de frames zijn aangepast
                            M.toast({html: 'Frames zijn aangepast!', displayLength: 3000, classes: 'green rounded center'});

                            aantallist = frameiddmwt.split(".");

                            //doet terug dezelfde stappen als hiervoor om de frames te laten tonen op de pagina. Maar dan wel geupdate
                            aantal=0;
                            for ( i in aantallist) {
                                aantal++;
                            }
                            if ((frameiddmwt == "null")||(frameiddmwt =="")) {
                                aantal=0;
                            }
                            $('#dataklantenframes').html(aantal);

                            $('#0frames').hide();
                            $('#1frames').hide();
                            $('#2frames').hide();
                            $('#3frames').hide();
                            $('#4frames').hide();
                            $('#5frames').hide();

                            if ((aantal == 1) && (aantallist[0] != "undefined")) {
                                $('#0frames').show();
                                $('#1frames').show();
                                $('#dataklantenframesid1').html(aantallist[0]);
                            }
                            if (aantal == 2) {
                                $('#0frames').show();
                                $('#1frames').show();
                                $('#2frames').show();
                                $('#dataklantenframesid1').html(aantallist[0]);
                                $('#dataklantenframesid2').html(aantallist[1]);
                            }
                            if (aantal == 3) {
                                $('#0frames').show();
                                $('#1frames').show();
                                $('#2frames').show();
                                $('#3frames').show();
                                $('#dataklantenframesid1').html(aantallist[0]);
                                $('#dataklantenframesid2').html(aantallist[1]);
                                $('#dataklantenframesid3').html(aantallist[2]);
                            }
                            if (aantal == 4) {
                                $('#0frames').show();
                                $('#1frames').show();
                                $('#4frames').show();
                                $('#2frames').show();
                                $('#3frames').show();
                                $('#dataklantenframesid1').html(aantallist[0]);
                                $('#dataklantenframesid2').html(aantallist[1]);
                                $('#dataklantenframesid3').html(aantallist[2]);
                                $('#dataklantenframesid4').html(aantallist[3]);
                            }
                            if (aantal == 5) {
                                $('#0frames').show();
                                $('#1frames').show();
                                $('#4frames').show();
                                $('#2frames').show();
                                $('#3frames').show();
                                $('#5frames').show();
                                $('#dataklantenframesid1').html(aantallist[0]);
                                $('#dataklantenframesid2').html(aantallist[1]);
                                $('#dataklantenframesid3').html(aantallist[2]);
                                $('#dataklantenframesid4').html(aantallist[3]);
                                $('#dataklantenframesid5').html(aantallist[4]);
                            }
                            if (aantal > 5) {
                                $('#0frames').show();
                                $('#1frames').show();
                                $('#dataklantenframesid1').html(aantallist);
                            }

                            dataframes = aantal;


                            if (dataframeid == "undefined") {
                                dataframes = "0";
                            }

                            if (aantal > 1) {
                                klantframesbutton.textContent = "Frames tonen";
                            } else {
                                klantframesbutton.textContent = "Frame tonen";
                            }
                            body.appendChild(klantframesbutton);




                        }



                    });
                    $('.sidenav a').click(function () {
                        klantframesbutton.textContent = "";

                    });

                    //wanneer er op de reminder versturen gedrukt word
                    $('#reminder').click(async function () {
                        const accountSid = #sid;
                    const authToken = #authtoken;
                        const client = require('twilio')(accountSid, authToken);
                        //maak een berichti aan met de tekst, telefoonnummer van twilio en to een gsmnummer, in dit geval de telefoonnummer van de klant
                        client.messages
                            .create({
                                body: 'Dit is een geautomatiseerd bericht. Gelieve je A-frames van de tegels terug te brengen. Mvg, Coeck NV',
                                from: '+12056353774',
                                to: gsmnummer
                            })
                            //toon een message dat deze verstuurd is.
                            .then(M.toast({html: 'Reminder is verzonden!', displayLength: 3000, classes: 'green rounded center'}));
                    });

                }));
            }


            //anders is er maar 1 klant gevonden
            else {
                aantallist=[];
                console.log("ik zit in klanten gevonden 1");
                $('#tabBoven').show();
                $('#tabBeneden').hide();
                //neemt alle data
                dataklantid = klanten[i][0];
                datanaam = klanten[i][1];
                datafamilienaam = klanten[i][2];
                dataland = klanten[i][3];
                datagemeente = klanten[i][4];
                datapostcode = klanten[i][5];
                datastraat = klanten[i][6];
                datahuisnummer = klanten[i][7];
                dataframeid = klanten[i][8];
                gsmnummer = klanten[i][9];
                aantallist = dataframeid.split(".");
                //maak alle input fields leeg
                $('#naam').val("").empty();
                $('#klantenid').val("").empty();
                $('#gemeente').val("").empty();
                $('#familienaam').val("").empty();
                $('#land').val("").empty();
                $('#postcode').val("").empty();
                $('#straat').val("").empty();
                $('#huisnummer').val("").empty();
                var aantal = 0;
                //voor elke frame getal +1
                for (i in aantallist) {
                    aantal++;
                }
                //als de input null of niks is dan aantal = 0
                if ((dataframeid == "null")||(dataframeid =="")) {
                    aantal=0;
                }
                //maken van strings om te tonen in .html
                const adres = datastraat + " " + datahuisnummer + ",<br>" + datapostcode + " " + datagemeente +",<br>" + dataland;
                const adres2 = datastraat + "," + datahuisnummer + "," + datapostcode + "," + datagemeente+","+dataland;
                //hide alle frames
                $('#0frames').hide();
                $('#1frames').hide();
                $('#2frames').hide();
                $('#3frames').hide();
                $('#4frames').hide();
                $('#5frames').hide();
                //als er 1 frame is
                if ((aantal == 1) && (aantallist[0] != "undefined")) {
                    $('#0frames').show();
                    $('#1frames').show();
                    $('#dataklantenframesid1').html(aantallist[0]);
                }
                //als er 2 frames zijn
                if (aantal == 2) {
                    $('#0frames').show();
                    $('#1frames').show();
                    $('#2frames').show();
                    $('#dataklantenframesid1').html(aantallist[0]);
                    $('#dataklantenframesid2').html(aantallist[1]);
                }
                //als er 3 frames zijn
                if (aantal == 3) {
                    $('#0frames').show();
                    $('#1frames').show();
                    $('#2frames').show();
                    $('#3frames').show();
                    $('#dataklantenframesid1').html(aantallist[0]);
                    $('#dataklantenframesid2').html(aantallist[1]);
                    $('#dataklantenframesid3').html(aantallist[2]);
                }
                //als er 4 frames zijn
                if (aantal == 4) {
                    $('#0frames').show();
                    $('#1frames').show();
                    $('#4frames').show();
                    $('#2frames').show();
                    $('#3frames').show();
                    $('#dataklantenframesid1').html(aantallist[0]);
                    $('#dataklantenframesid2').html(aantallist[1]);
                    $('#dataklantenframesid3').html(aantallist[2]);
                    $('#dataklantenframesid4').html(aantallist[3]);
                }
                //als er 5 frames zijn
                if (aantal == 5) {
                    $('#0frames').show();
                    $('#1frames').show();
                    $('#4frames').show();
                    $('#2frames').show();
                    $('#3frames').show();
                    $('#5frames').show();
                    $('#dataklantenframesid1').html(aantallist[0]);
                    $('#dataklantenframesid2').html(aantallist[1]);
                    $('#dataklantenframesid3').html(aantallist[2]);
                    $('#dataklantenframesid4').html(aantallist[3]);
                    $('#dataklantenframesid5').html(aantallist[4]);
                }
                //als het aantal groter is dan 5
                if (aantal > 5) {
                    $('#0frames').show();
                    $('#1frames').show();
                    $('#dataklantenframesid1').html(aantallist);
                }

                dataframes = aantal;

                //als datarameid == undefined zet dataframes/aantal op 0
                if (dataframeid == "undefined") {
                    dataframes = "0";
                }
                //zet land to internation code
                codegsm =landtocodegsm(dataland);
                //toon data op de html pagina
                $('#dataklantenid').html(dataklantid);
                $('#dataklantennaam').html(datanaam);
                $('#dataklantenfamilie').html(datafamilienaam);
                $('#dataklantenland').html(dataland);
                $('#dataklantengemeente').html(datagemeente);
                $('#dataklantenpostcode').html(datapostcode);
                $('#dataklantenstraat').html(datastraat);
                $('#dataklantenhuisnummer').html(datahuisnummer);
                $('#dataklantenframes').html(dataframes);
                $('#dataklantengsm').html(gsmnummer);
                if (dataframes > 0) {
                    $('#dataklantenframesid').html(aantallist);
                }
                $('#dataklantenadres').html(`${adres}`);
                var body = document.getElementById("framestonen");

                if (aantal > 1) {
                    klantframesbutton.textContent = "Frames tonen";
                } else {
                    klantframesbutton.textContent = "Frame tonen";
                }

                klantframesbutton.classList.add("buttonclass");
                //als er gedrukt word op edit adres
                $('#editadres').click( async function (event) {
                    //zorgt ervoor dat de notificatie niet meerdere keren getoond worden
                    event.stopImmediatePropagation();
                    //maken van buttons
                    let buttons = ['Change','Cancel'];
                    //maken van een notificatie
                    navigator.notification.prompt("Weet je zeker dat je het adres wilt veranderen?", onPrompt, `${adres2}`, buttons);
                    //als de notificatie goed is ingevuld
                    async function onPrompt(buttonIndex){
                        //zorgt ervoor dat de notificatie niet meerdere keren getoond worden
                        event.stopImmediatePropagation();
                        //als er op de change button gedrukt is
                        if (buttonIndex.buttonIndex == 1){
                            let inputtest = buttonIndex.input1.split(".");
                            // internationale code voor gsm opvragen met het ingevulde land
                            codegsm =landtocodegsm(inputtest[4]);
                            await editklantadres(klanten[0][0],inputtest[0],inputtest[1],inputtest[2],inputtest[3],inputtest[4]);

                            const adres = inputtest[0] + " " + inputtest[1] + ",<br>" + inputtest[2] + " " + inputtest[3] +",<br>" + inputtest[4];
                            $('#dataklantenadres').html(`${adres}`);
                        }
                    }
                });

                //als er op editgsm gedrukt word
                $('#editgsm').click( async function (event) {
                    //zorgt ervoor dat de notificatie niet meerdere keren getoond word
                    event.stopImmediatePropagation();
                    //maak 2 buttons aan
                    let buttons = ['Change','Cancel'];
                    //maak notificatie aan
                    navigator.notification.prompt("Weet je zeker dat je de gsm-nummer wilt veranderen?", onPrompt, `${gsmnummer}`, buttons);
                    //als de notificatie goed is ingevuld
                    async function onPrompt(buttonIndex){
                        //zorgt ervoor dat de notificatie niet meerdere keren getoont kan worden
                        event.stopImmediatePropagation();
                        //als er op change gedrukt word verander het gsm nummer
                        if(buttonIndex.buttonIndex == 1){
                            let inputtest = buttonIndex.input1;
                            if (inputtest.includes("+")){
                                gsmnummer=inputtest;
                            }
                            else{
                                gsmnummer=codegsm + inputtest.substring(1);
                            }
                            await editklantgsm(`${dataklantid}`,gsmnummer);
                            $('#dataklantengsm').html(gsmnummer);
                        }

                    }
                });
                //als er op editframes gedrukt word
                $('#submitbuttoneditframes').click(async function () {
                    var error=0;
                    var errorlist= [];
                    var errorklant = [];
                    var errortekst = "";
                    var klanten = await getklanten();
                    //vraag het input field valeus op
                    var frameiddmwt = $('#frametoevoegen').val();
                    //split de data op .
                    gewildeframes = frameiddmwt.split(".");
                    //voor elke klant en voor elke gewilde frameid
                    for (i in klanten){
                        for (k in gewildeframes) {
                            //als de klant het gewilde frame heeft zet error en push de klant in een list
                            if (klanten[i][8] == gewildeframes[k]) {
                                error = 1;
                                errorlist.push(gewildeframes[k]);
                                errorklant.push(klanten[i]);
                                errortekst = klanten[i][1] + " " + klanten[i][2] + " met userid:" + klanten[i][0] + " heeft frameid " + klanten[i][8];
                            }
                        }

                    }
                    //als iemand anders al het frameid heeft, toon een bericht, en toon de klant in html text
                    if (error == 1) {
                        $('#errors').html(errortekst);
                        M.toast({html: `Niet mogelijk om de frameid('s) te veranderen!`, displayLength: 3000, classes: 'red rounded center'});
                    }
                    //anders de frames van de klant aan
                    else{
                        //maakt input field leeg
                        $('#frametoevoegen').empty();
                        $('#errors').html(" ");
                        //veranderd de frames
                        await framestoevoegen(dataklantid, frameiddmwt);
                        //message
                        M.toast({html: 'Frames zijn aangepast!', displayLength: 3000, classes: 'green rounded center'});
                        aantallist = frameiddmwt.split(".");
                        //repeated code om de pagina op een snelle manier te refreshen
                        aantal=0;
                        for ( i in aantallist) {
                            aantal++;
                        }
                        if ((frameiddmwt == "null")||(frameiddmwt =="")) {
                            aantal=0;
                        }
                        $('#dataklantenframes').html(aantal);

                        $('#0frames').hide();
                        $('#1frames').hide();
                        $('#2frames').hide();
                        $('#3frames').hide();
                        $('#4frames').hide();
                        $('#5frames').hide();

                        if ((aantal == 1) && (aantallist[0] != "undefined")) {
                            $('#0frames').show();
                            $('#1frames').show();
                            $('#dataklantenframesid1').html(aantallist[0]);
                        }
                        if (aantal == 2) {
                            $('#0frames').show();
                            $('#1frames').show();
                            $('#2frames').show();
                            $('#dataklantenframesid1').html(aantallist[0]);
                            $('#dataklantenframesid2').html(aantallist[1]);
                        }
                        if (aantal == 3) {
                            $('#0frames').show();
                            $('#1frames').show();
                            $('#2frames').show();
                            $('#3frames').show();
                            $('#dataklantenframesid1').html(aantallist[0]);
                            $('#dataklantenframesid2').html(aantallist[1]);
                            $('#dataklantenframesid3').html(aantallist[2]);
                        }
                        if (aantal == 4) {
                            $('#0frames').show();
                            $('#1frames').show();
                            $('#4frames').show();
                            $('#2frames').show();
                            $('#3frames').show();
                            $('#dataklantenframesid1').html(aantallist[0]);
                            $('#dataklantenframesid2').html(aantallist[1]);
                            $('#dataklantenframesid3').html(aantallist[2]);
                            $('#dataklantenframesid4').html(aantallist[3]);
                        }
                        if (aantal == 5) {
                            $('#0frames').show();
                            $('#1frames').show();
                            $('#4frames').show();
                            $('#2frames').show();
                            $('#3frames').show();
                            $('#5frames').show();
                            $('#dataklantenframesid1').html(aantallist[0]);
                            $('#dataklantenframesid2').html(aantallist[1]);
                            $('#dataklantenframesid3').html(aantallist[2]);
                            $('#dataklantenframesid4').html(aantallist[3]);
                            $('#dataklantenframesid5').html(aantallist[4]);
                        }
                        if (aantal > 5) {
                            $('#0frames').show();
                            $('#1frames').show();
                            $('#dataklantenframesid1').html(aantallist);
                        }

                        dataframes = aantal;


                        if (dataframeid == "undefined") {
                            dataframes = "0";
                        }

                        if (aantal > 1) {
                            klantframesbutton.textContent = "Frames tonen";
                        } else {
                            klantframesbutton.textContent = "Frame tonen";
                        }
                        body.appendChild(klantframesbutton);




                    }


                });
                $('.sidenav a').click(function () {
                    klantframesbutton.textContent = "";
                });
                //wanneer er op de reminder knop gedrukt word
                $('#reminder').click(async function () {
                    const accountSid = #sid;
                    const authToken = #authtoken;
                    const client = require('twilio')(accountSid, authToken);

                    //maak een bericht aan met de volgende tekst, van het twilio nummer, naar de klant zijn gsm nummer, daarna toon een notificatie
                    client.messages
                        .create({
                            body: 'Dit is een geautomatiseerd bericht. Gelieve je A-frames van de tegels terug te brengen. Mvg, Coeck NV',
                            from: '+12056353774',
                            to: gsmnummer
                        })
                        .then(M.toast({html: 'Reminder is verzonden!', displayLength: 3000, classes: 'green rounded center'}));
                });

            }

            //als er frame tonen of frames tonen gedrukt word
            klantframesbutton.addEventListener("click", async function () {
                $('#tabTutorial').show();
                $('#tabBoven').hide();
                var counterk=0;
                //voor elke frame dat getoond moet worden getl + 1
                for (i in aantallist) {
                    counterk++;
                }
                var div = document.getElementById("map_canvas");
                var map = plugin.google.maps.Map.getMap(div);
                //aanmaken van een list
                markers3 = [];

                //als het getal groter is dan 1 toon de frames op een map gecentreerd op belgië anders neem je de camera coordianten van de frames zelf en zoom je een klein beetje uit
                for (i in aantallist) {
                    dataframe = await getdataonframeid(aantallist[i]);
                    if (counterk>1) {
                        map.animateCamera({
                            target: {lat: 50.64022, lng: 4.66667},
                            zoom: 7,
                            tilt: 0,
                            bearing: 0,
                            duration: 2500
                        });
                    }
                    else {
                        map.animateCamera({
                            target: {lat: dataframe[0][2], lng: dataframe[0][3]},
                            zoom: 17,
                            tilt: 0,
                            bearing: 0,
                            duration: 3000
                        });
                    }
                    //maken van een marker
                    var marker3 = map.addMarker({
                        position: {lat: dataframe[0][2], lng: dataframe[0][3]},
                        title: "Frameid: " + dataframe[0][0],
                        // snippet: database[i][4] + ", " + database[i][5] + ", " + database[i][6] + ", " + database[i][7] + ", " + database[i][8] + ", " + database[i][9] + ", " + database[i][10],
                        snippet: dataframe[0][1] + ", " + dataframe[0][4] + ", " + dataframe[0][5] + ", " + dataframe[0][6] + ", " + dataframe[0][7] + ", " + dataframe[0][8] + ", " + dataframe[0][9] + ", " + dataframe[0][10],
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
                            size: {
                                width: 32,
                                height: 32
                            }
                        },
                        animation: plugin.google.maps.Animation.BOUNCE
                    });
                    //markers toevoegen aan de list
                    markers3.push(marker3);
                    allmarkers.push(marker3);


                    for ( e in markers3){
                        markers3[e].showInfoWindow();
                    }
                }

            },false);
            body.appendChild(klantframesbutton);
        }
        else{
            $('#tabmakeklant').hide();
            $('#tabBeneden').hide();
            $('#tabBoven').hide();
            $('#tabTutorial').hide();
            $('#tabIntro').hide();
            $('#tabInstelligen').show();
        }
    });

}, false);



function onDeviceReady() {
    // console.log('Device is ready');
    // Shake.init();
}
