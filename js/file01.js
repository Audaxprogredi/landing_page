import { fetchProducts } from "./functions";
import { getVotes } from './firebase.js';

"use strict";

/**
 * Renderiza hasta seis productos en el contenedor principal.
 *
 * @returns {void} No devuelve ningún valor.
 */


const displayVotes = async () => {
  // 2. Esperar por la obtención de los votos
  const votes = await getVotes();
  
  // 3. Generar el contenido HTML de la tabla
  let tableHTML = `
    <table border="1">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Total de Votos</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Iterar sobre los datos obtenidos
  votes.forEach(vote => {
    tableHTML += `
      <tr>
        <td>${vote.producto}</td>
        <td>${vote.totalVotos}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  // 4. Insertar la tabla completa en el elemento con ID 'results'
  document.getElementById('results').innerHTML = tableHTML;
};

// 5. Invocar la función dentro de una función de autoejecución (IIFE) asíncrona
(async () => {
  await displayVotes();
})();


const renderProducts = () => {
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json')
        .then(result => {
            // Procesar el resultado
            if (result.success) {
                //Primer caso
                let container = document.getElementById("products-container")
                container.innerHTML = ""

                let products = result.body.slice(0, 6);
                
                products.forEach(product => {
                    let productHTML = `
                        <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                            <img
                                class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                                src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                            <h3
                                class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                                $[PRODUCT.PRICE]
                            </h3>

                            <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                                <div class="space-y-2">
                                    <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                        Ver en Amazon
                                    </a>
                                    <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                                </div>
                            </div>
                        </div>`;

                    productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", product.title)
                    productHTML = productHTML.replaceAll("[PRODUCT.IMGURL]", product.imgUrl)


                    container.innerHTML += productHTML;
                });
            } 
        });
};

import { fetchCategories } from "./functions";

/**
 * Carga y muestra las categorías disponibles en un selector HTML.
 *
 * @returns {Promise<void>} Una promesa que finaliza cuando se actualiza el selector.
 */
async function renderCategories() {
    try {
        const result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');
        if (result.success) {
            let container = document.getElementById("categories");

            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;
            const categoriesXML = result.body;
            const categories = categoriesXML.getElementsByTagName("category");

            for (let category of categories) {

                let categoryHTML = `<option value="[ID]">[NAME]</option>`;

                let id = category.getElementsByTagName("id")[0].textContent;
                let name = category.getElementsByTagName("name")[0].textContent;
                
                categoryHTML = categoryHTML.replaceAll("[ID]", id);
                categoryHTML = categoryHTML.replaceAll("[NAME]", name);

                container.innerHTML += categoryHTML;
            
            }   
        }
    } catch (error) {
        alert(result.body);
    }
}


/**
 * Activa la visualización del toast interactivo.
 *
 * @returns {void} No devuelve ningún valor.
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Asocia el evento de clic al botón de demostración para abrir un video.
 *
 * @returns {void} No devuelve ningún valor.
 */
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
})();