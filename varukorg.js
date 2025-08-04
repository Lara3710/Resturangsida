// Läs av tryck på + och - knappar genom addeventlistener
// Om plus
//      add maträtt till array
// Om minus
//      ta bort maträtt från array

// Använd reduce för att addera ihop alla maträtternas priser och diplaya det längst ner
// Vid klick av betala knappen står det
// "Du har betalat!", + rensa varukorg
// Utanför varukorg visas hur många varor man har i varukorgen

const Varukorg = (() => {

    const TemplateLiteral = {
        VarukorgMaträtt: (title, id, price, antal, priceText) => {
            return `
                <li class="varukorgsMaträtt" id="VarMaträtt_${id}">
                        <section>
                            <h3>${title}</h3>
                            <p>${priceText} ${price} kr</p>
                        </section>
                        <nav class="varukorgMaträttBtns">
                            <button class="varukorgMaträttBtn varMinusBtn">—</button>
                            <p>${antal}</p>
                            <button class="varukorgMaträttBtn varAddBtn">+</button>
                        </nav>
                    </li>
            `
        }
    }

    const HanteraMaträtter = {
        LäggTillMaträtt: (knapp, maträtter) => {
            // När man trycker på + så startas denna metod, men koden till knapp ska INTE vara här
            // När en plus knapp trycks, leta efter vilken maträtt knappen tillhör
            // Lägg till den maträttens objekt i maträtt arrayen
            // Sätt in i localstorage
            let maträttId;
            if(knapp.closest(".maträtt"))
            {
                maträttId = knapp.closest(".maträtt").id.replace("meal_", "");
            }
            else if(knapp.closest(".varukorgsMaträtt"))
            {
                maträttId = knapp.closest(".varukorgsMaträtt").id.replace("VarMaträtt_", "");
            }

            maträttId = parseInt(maträttId);

            Localstorage.SparaMaträtt(maträtter[maträttId - 1]);
            HanteraMaträtter.RenderaMaträtt(maträtter);

            Betala.GömBetalaText();
        },
        TaBortMaträtt: (knapp, maträtter) => {
            const maträttId = knapp.closest(".varukorgsMaträtt").id.replace("VarMaträtt_", "");
            Localstorage.MinskaEnFrånLs(maträttId);
            HanteraMaträtter.RenderaMaträtt(maträtter);
        },
        RenderaMaträtt: (maträtter) => {
            
            const varukorgTag = document.querySelector(".varukorgUL");

            varukorgTag.innerHTML = "";

            const varukorgMaträtter = Localstorage.HämtaSparadeMaträtter();

            
            const priceText = JSON.parse(localStorage.getItem("mealText")).price;

            varukorgMaträtter.forEach(maträtt => {

                const språk = localStorage.getItem("language");
                let TL;
                if(språk === "en")
                {
                    TL = TemplateLiteral.VarukorgMaträtt(maträtt.namn.en, maträtt.id, maträtt.pris, maträtt.antal, priceText);
                }
                else if(språk === "sv")
                {
                    TL = TemplateLiteral.VarukorgMaträtt(maträtt.namn.sv, maträtt.id, maträtt.pris, maträtt.antal, priceText);   
                }

                if(!document.querySelector("#VarMaträtt_" + maträtt.id))
                {

                    varukorgTag.innerHTML += TL;
                }

            });
            HanteraMaträtter.RäknaTotalKostnad(varukorgMaträtter);
            HanteraMaträtter.VisaAntalBeställningar(varukorgMaträtter);

            Knappar.KopplaVarukorgMaträttKnappar(maträtter);
        },
        RäknaTotalKostnad: (varukorgMaträtter) => {
            const total =  varukorgMaträtter.reduce( (acc, e) => {
                return acc + e.pris * e.antal;
            }, 0);

            const totalTag = document.querySelector(".attBetala");
            totalTag.textContent = "Total: " + total + " Kr";
        },
        VisaAntalBeställningar: (varukorgMaträtter) => {
            const antalBestlPTag = document.querySelector(".antalBeställningar");

            if(varukorgMaträtter.length > 0)
            {
                const antal = varukorgMaträtter.reduce( (acc, e) => {
                    return acc + e.antal;
                }, 0);

                antalBestlPTag.textContent = antal;
                antalBestlPTag.hidden = false;

            }
            else
            {
                antalBestlPTag.textContent = 0;
                antalBestlPTag.hidden = true;
            }
        }
    }

    const Knappar = {
        KopplaBetalaKnapp: (maträtter) => {
            const betalaKnappTag = document.querySelector(".betalaKnapp");
            betalaKnappTag.addEventListener('click', (e) => Betala.Betala(maträtter, e));
        },
        KopplaPlusKnappar: (maträtter) => {
            const plusKnappar = document.querySelectorAll(".addBtn");

            plusKnappar.forEach(knapp => {
                knapp.addEventListener("click", () => HanteraMaträtter.LäggTillMaträtt(knapp, maträtter) );
            });
        },
        KopplaVarukorgMaträttKnappar: (maträtter) => {
            const plusKnappar = document.querySelectorAll(".varAddBtn");

            plusKnappar.forEach(knapp => {
                knapp.addEventListener("click", () => HanteraMaträtter.LäggTillMaträtt(knapp, maträtter));
            });

            const minusKnappar = document.querySelectorAll(".varMinusBtn");

            minusKnappar.forEach(knapp => {
                knapp.addEventListener("click", () => HanteraMaträtter.TaBortMaträtt(knapp, maträtter));
            });
        }
    }


    const Betala = {
        Betala: (maträtter, e) => {
            e.stopPropagation();
            e.preventDefault();
            Localstorage.TaBortAllaFrånLs();
            Betala.VisaBetalaText();
            HanteraMaträtter.RenderaMaträtt(maträtter);
        },
        VisaBetalaText: () =>{
            const betalatPTag = document.querySelector(".betalatMeddelande");
            betalatPTag.hidden = false;
        },
        GömBetalaText: () => {
            const betalatPTag = document.querySelector(".betalatMeddelande");
            betalatPTag.hidden = true;
        }
    }

    const Localstorage = {
        SparaMaträtt: (maträtt) => {
            const key = "maträtt_" + maträtt.id;
            const sparad = localStorage.getItem(key); // Kolla om en maträtt med denna key redan finns

            if (sparad) {
                const obj = JSON.parse(sparad);
                obj.antal += 1;
                localStorage.setItem(key, JSON.stringify(obj));
            } else {
                const kopia = { // Skapa en kopia av maträtten i menyn och lägg till antal
                    id: maträtt.id,
                    namn: maträtt.namn,
                    pris: maträtt.pris,
                    antal: 1
                };
                localStorage.setItem(key, JSON.stringify(kopia));
            }
        },
        HämtaSparadeMaträtter: () => {
            const SparaMaträtter = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if(key.startsWith("maträtt_"))
                {
                    const maträttObj = JSON.parse(localStorage.getItem(key));
                    SparaMaträtter.push(maträttObj);
                }
            }

            return SparaMaträtter;
        },
        MinskaEnFrånLs: (maträttId) => {
            const key = "maträtt_" + maträttId;
            const maträttJSON = JSON.parse(localStorage.getItem(key));
            maträttJSON.antal--;

            if(maträttJSON.antal <= 0)
            {
                localStorage.removeItem(key);
            }
            else 
            {
                localStorage.setItem(key, JSON.stringify(maträttJSON));
            }
        },
        TaBortAllaFrånLs: () => {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if(key.startsWith("maträtt_"))
                {
                    localStorage.removeItem(key);
                }
            }
        }
    }

    const Main = (maträtter) => {
        HanteraMaträtter.RenderaMaträtt(maträtter);
        Knappar.KopplaBetalaKnapp(maträtter);
        Knappar.KopplaPlusKnappar(maträtter);
    }

    return { Main }
})();

export { Varukorg };
