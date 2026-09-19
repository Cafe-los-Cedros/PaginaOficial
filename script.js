/* ==========================================================
   CAFÉ LOS CEDROS — JAVASCRIPT
   ----------------------------------------------------------
   Este archivo se encarga de las funciones interactivas que
   hacen que la página se sienta dinámica sin depender de
   librerías externas.

   FUNCIONES PRINCIPALES:
   1. Menú móvil.
   2. Encabezado con efecto al hacer scroll.
   3. Animaciones de aparición con IntersectionObserver.
   4. Navegación activa según la sección visible.
   5. Galería expandible.
   6. Lightbox para ampliar las fotografías.
   7. Flechas y teclado para navegar el lightbox.
   8. Enlace de WhatsApp configurable.
   9. Enlaces opcionales de Facebook y TikTok.
   10. Año automático en el pie de página.
   11. Fallback del logo si el archivo indicado no existe.
   ========================================================== */

'use strict';

/* ==========================================================
   1. CONFIGURACIÓN DE LA MARCA
   ----------------------------------------------------------
   IMPORTANTE:
   Cambia whatsappNumber por el número real de la marca.

   Debe escribirse así:
   573001234567

   SIN:
   +57
   espacios
   paréntesis
   guiones
   ========================================================== */

const BRAND_CONFIG = {

    // Número de WhatsApp de Café Los Cedros
    whatsappNumber: '573133105097',

    // Mensaje que aparecerá automáticamente en WhatsApp
    whatsappMessage:
        'Hola, quiero conocer más sobre Café Los Cedros y hacer un pedido.',

    // Instagram oficial
    instagramUrl:
        'https://www.instagram.com/cafeloscedros.huila/',

    // Puedes agregarlos después si la marca los crea
    facebookUrl: '',
    tiktokUrl: 'https://www.tiktok.com/@cafeloscedros.huila'
};


/* ==========================================================
   2. REFERENCIAS A LOS ELEMENTOS DEL HTML
   ----------------------------------------------------------
   Aquí guardamos los elementos importantes de la página para
   poder manipularlos posteriormente con JavaScript.
   ========================================================== */

const elements = {

    body: document.body,

    header: document.querySelector('.site-header'),

    menuToggle: document.getElementById('menuToggle'),

    mainNav: document.getElementById('mainNav'),

    navLinks: [
        ...document.querySelectorAll('.nav-link')
    ],

    revealItems: [
        ...document.querySelectorAll('.reveal')
    ],

    sections: [
        ...document.querySelectorAll('main section[id]')
    ],

    logo: document.getElementById('brandLogo'),

    galleryGrid: document.getElementById('galleryGrid'),

    toggleGallery: document.getElementById('toggleGallery'),

    galleryItems: [
        ...document.querySelectorAll('.gallery-item')
    ],

    lightbox: document.getElementById('lightbox'),

    lightboxImage: document.getElementById('lightboxImage'),

    lightboxCaption: document.getElementById('lightboxCaption'),

    lightboxClose: document.getElementById('lightboxClose'),

    lightboxPrev: document.getElementById('lightboxPrev'),

    lightboxNext: document.getElementById('lightboxNext'),

    whatsappButton: document.getElementById('whatsappButton'),

    whatsappHint: document.getElementById('whatsappHint'),

    facebookLink: document.getElementById('facebookLink'),

    tiktokLink: document.getElementById('tiktokLink'),

    currentYear: document.getElementById('currentYear')
};


/* ==========================================================
   3. MENÚ MÓVIL
   ----------------------------------------------------------
   Estas funciones permiten abrir y cerrar el menú cuando la
   página se está viendo desde un celular.
   ========================================================== */


/* Cierra el menú */
function closeMenu() {

    elements.mainNav?.classList.remove('is-open');

    elements.menuToggle?.classList.remove('is-open');

    elements.menuToggle?.setAttribute(
        'aria-expanded',
        'false'
    );

    elements.menuToggle?.setAttribute(
        'aria-label',
        'Abrir menú'
    );

    elements.body.classList.remove('menu-open');
}


/* Abre el menú */
function openMenu() {

    elements.mainNav?.classList.add('is-open');

    elements.menuToggle?.classList.add('is-open');

    elements.menuToggle?.setAttribute(
        'aria-expanded',
        'true'
    );

    elements.menuToggle?.setAttribute(
        'aria-label',
        'Cerrar menú'
    );

    elements.body.classList.add('menu-open');
}


/* Alterna entre abrir y cerrar */
function toggleMenu() {

    const isOpen =
        elements.mainNav?.classList.contains('is-open');

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}


/* Evento del botón del menú */
elements.menuToggle?.addEventListener(
    'click',
    toggleMenu
);


/* Cuando se selecciona una sección, cerramos el menú */
elements.navLinks.forEach((link) => {

    link.addEventListener(
        'click',
        closeMenu
    );

});


/* Tecla ESC para cerrar el menú */
document.addEventListener(
    'keydown',
    (event) => {

        if (event.key === 'Escape') {
            closeMenu();
        }

    }
);


/* ==========================================================
   4. HEADER CON EFECTO DE SCROLL
   ----------------------------------------------------------
   Cuando el usuario baja un poco en la página, el header
   obtiene una clase adicional para cambiar su apariencia.
   ========================================================== */

function updateHeaderOnScroll() {

    const shouldHaveBackground =
        window.scrollY > 28;

    elements.header?.classList.toggle(
        'is-scrolled',
        shouldHaveBackground
    );
}


/* Ejecutamos una vez al cargar */
updateHeaderOnScroll();


/* Ejecutamos cada vez que se hace scroll */
window.addEventListener(
    'scroll',
    updateHeaderOnScroll,
    {
        passive: true
    }
);


/* ==========================================================
   5. ANIMACIONES DE APARICIÓN
   ----------------------------------------------------------
   IntersectionObserver detecta cuándo un elemento aparece
   en pantalla.

   Esto permite que las secciones entren suavemente cuando
   el usuario baja por la página.
   ========================================================== */

const revealObserver =
    new IntersectionObserver(

        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        'is-visible'
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


/* Observamos todos los elementos con .reveal */
elements.revealItems.forEach((item) => {

    revealObserver.observe(item);

});


/* ==========================================================
   6. NAVEGACIÓN ACTIVA
   ----------------------------------------------------------
   El enlace correspondiente a la sección que estamos viendo
   se marca automáticamente.
   ========================================================== */

const sectionObserver =
    new IntersectionObserver(

        (entries) => {

            const visibleSections =
                entries.filter(
                    (entry) =>
                        entry.isIntersecting
                );


            if (!visibleSections.length) {
                return;
            }


            const sectionId =
                visibleSections.sort(

                    (a, b) =>
                        b.intersectionRatio -
                        a.intersectionRatio

                )[0].target.id;


            elements.navLinks.forEach(
                (link) => {

                    const matches =
                        link.getAttribute('href') ===
                        `#${sectionId}`;


                    link.classList.toggle(
                        'is-active',
                        matches
                    );

                }
            );

        },

        {
            rootMargin:
                '-25% 0px -60% 0px',

            threshold: [
                0.05,
                0.2,
                0.5
            ]
        }

    );


/* Observamos todas las secciones */
elements.sections.forEach(
    (section) => {

        sectionObserver.observe(section);

    }
);


/* ==========================================================
   7. GALERÍA EXPANDIBLE
   ----------------------------------------------------------
   Permite mostrar inicialmente algunas fotografías y después
   mostrar todas con un botón.
   ========================================================== */

let galleryExpanded = false;


elements.toggleGallery?.addEventListener(
    'click',
    () => {

        galleryExpanded =
            !galleryExpanded;


        elements.galleryGrid?.classList.toggle(
            'is-expanded',
            galleryExpanded
        );


        elements.toggleGallery.textContent =
            galleryExpanded

                ? 'Mostrar menos fotos'

                : 'Ver todas las fotos';


        /*
         * Cuando abrimos todas las fotos, hacemos scroll suave
         * hasta la primera imagen nueva.
         */

        if (galleryExpanded) {

            const firstExtra =
                elements.galleryGrid?.querySelector(
                    '.extra-gallery'
                );


            firstExtra?.scrollIntoView({

                behavior: 'smooth',

                block: 'nearest'

            });

        }

    }
);


/* ==========================================================
   8. LIGHTBOX
   ----------------------------------------------------------
   Permite hacer clic sobre una fotografía para verla grande.
   También permite cambiar de fotografía mediante las flechas.
   ========================================================== */


/*
 * Creamos un arreglo con las imágenes de la galería.
 */

const galleryData =
    elements.galleryItems.map(
        (item) => {

            const image =
                item.querySelector('img');

            const label =
                item.querySelector('span');


            return {

                src:
                    image?.getAttribute('src')
                    || '',

                alt:
                    image?.getAttribute('alt')
                    || 'Fotografía de Café Los Cedros',

                caption:
                    label?.textContent?.trim()
                    || ''

            };

        }
    );


/* Índice de la imagen actualmente abierta */
let currentGalleryIndex = 0;


/*
 * Carga una imagen dentro del lightbox.
 */

function renderLightbox(index) {

    if (!galleryData[index]) {
        return;
    }


    currentGalleryIndex =
        index;


    const data =
        galleryData[index];


    elements.lightboxImage.src =
        data.src;


    elements.lightboxImage.alt =
        data.alt;


    elements.lightboxCaption.textContent =
        `${data.caption} · ${data.alt}`;
}


/*
 * Abre el lightbox.
 */

function openLightbox(index) {

    renderLightbox(index);


    elements.lightbox?.classList.add(
        'is-open'
    );


    elements.lightbox?.setAttribute(
        'aria-hidden',
        'false'
    );


    elements.body.classList.add(
        'menu-open'
    );


    elements.lightboxClose?.focus();
}


/*
 * Cierra el lightbox.
 */

function closeLightbox() {

    elements.lightbox?.classList.remove(
        'is-open'
    );


    elements.lightbox?.setAttribute(
        'aria-hidden',
        'true'
    );


    elements.body.classList.remove(
        'menu-open'
    );


    /*
     * Después de cerrar eliminamos el src para liberar recursos.
     */

    window.setTimeout(
        () => {

            if (
                !elements.lightbox?.classList.contains(
                    'is-open'
                )
            ) {

                if (elements.lightboxImage) {

                    elements.lightboxImage.src = '';

                }

            }

        },
        250
    );
}


/*
 * Mostrar imagen anterior.
 */

function showPreviousImage() {

    const previousIndex =
        (
            currentGalleryIndex -
            1 +
            galleryData.length
        ) %
        galleryData.length;


    renderLightbox(previousIndex);
}


/*
 * Mostrar imagen siguiente.
 */

function showNextImage() {

    const nextIndex =
        (
            currentGalleryIndex +
            1
        ) %
        galleryData.length;


    renderLightbox(nextIndex);
}


/*
 * Abrimos la imagen cuando se hace clic.
 */

elements.galleryItems.forEach(
    (item, index) => {

        item.addEventListener(
            'click',
            () => {

                openLightbox(index);

            }
        );

    }
);


/* Botón de cerrar */
elements.lightboxClose?.addEventListener(
    'click',
    closeLightbox
);


/* Flecha anterior */
elements.lightboxPrev?.addEventListener(
    'click',
    showPreviousImage
);


/* Flecha siguiente */
elements.lightboxNext?.addEventListener(
    'click',
    showNextImage
);


/*
 * Si se hace clic fuera de la fotografía también se cierra.
 */

elements.lightbox?.addEventListener(
    'click',
    (event) => {

        if (
            event.target ===
            elements.lightbox
        ) {

            closeLightbox();

        }

    }
);


/*
 * Control mediante teclado:
 *
 * ← = imagen anterior
 * → = imagen siguiente
 * ESC = cerrar
 */

document.addEventListener(
    'keydown',
    (event) => {

        if (
            !elements.lightbox?.classList.contains(
                'is-open'
            )
        ) {

            return;

        }


        if (event.key === 'ArrowLeft') {

            showPreviousImage();

        }


        if (event.key === 'ArrowRight') {

            showNextImage();

        }


        if (event.key === 'Escape') {

            closeLightbox();

        }

    }
);


/* ==========================================================
   9. WHATSAPP
   ----------------------------------------------------------
   Creamos automáticamente el enlace de WhatsApp.

   Ejemplo:

   https://wa.me/573001234567
   ========================================================== */


/*
 * Comprueba si el número tiene un formato válido.
 */

function isWhatsappConfigured() {

    return /^57\d{8,12}$/.test(
        BRAND_CONFIG.whatsappNumber
    );

}


/*
 * Configura el botón de WhatsApp.
 */

function setupWhatsApp() {

    if (!elements.whatsappButton) {
        return;
    }


    /*
     * Si todavía no se ha puesto el número real,
     * mostramos un mensaje para el administrador.
     */

    if (!isWhatsappConfigured()) {

        elements.whatsappButton.href = '#';


        elements.whatsappButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault();


                if (elements.whatsappHint) {

                    elements.whatsappHint.textContent =
                        'Abre script.js y cambia whatsappNumber por el número real de Café Los Cedros.';

                }

            }
        );


        return;
    }


    /*
     * Convertimos el mensaje a un formato válido para URL.
     */

    const encodedMessage =
        encodeURIComponent(
            BRAND_CONFIG.whatsappMessage
        );


    /*
     * Creamos el enlace final.
     */

    elements.whatsappButton.href =
        `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodedMessage}`;


    if (elements.whatsappHint) {

        elements.whatsappHint.textContent =
            'También puedes escribirnos directamente para consultar disponibilidad.';

    }

}


/* Ejecutamos la configuración */
setupWhatsApp();


/* ==========================================================
   10. REDES SOCIALES OPCIONALES
   ----------------------------------------------------------
   Facebook y TikTok pueden quedar vacíos mientras la marca
   todavía no tenga esos perfiles.
   ========================================================== */

function setupOptionalSocial(
    element,
    url,
    networkName
) {

    if (!element) {
        return;
    }


    /*
     * Si existe una URL, activamos el botón.
     */

    if (url) {

        element.href =
            url;


        element.target =
            '_blank';


        element.rel =
            'noopener noreferrer';


        element.removeAttribute(
            'aria-disabled'
        );


        element.removeAttribute(
            'tabindex'
        );


        element.classList.remove(
            'is-disabled'
        );


        const small =
            element.querySelector('small');


        if (small) {

            small.textContent =
                `Abrir ${networkName}`;

        }

    }

}


/* Configuración de redes */
setupOptionalSocial(
    elements.facebookLink,
    BRAND_CONFIG.facebookUrl,
    'Facebook'
);


setupOptionalSocial(
    elements.tiktokLink,
    BRAND_CONFIG.tiktokUrl,
    'TikTok'
);


/* ==========================================================
   11. FALLBACK DEL LOGO
   ----------------------------------------------------------
   Primero intenta cargar:

   logo/logo.png

   Si no existe, intenta:

   logo/Logo-removebg-preview.png
   ========================================================== */

let logoFallbackUsed = false;


elements.logo?.addEventListener(
    'error',
    () => {

        /*
         * Evita entrar en un bucle infinito.
         */

        if (logoFallbackUsed) {
            return;
        }


        logoFallbackUsed = true;


        elements.logo.src =
            'logo/Logo-removebg-preview.png';

    }
);


/* ==========================================================
   12. AÑO AUTOMÁTICO
   ----------------------------------------------------------
   El año del footer se actualiza automáticamente.
   ========================================================== */

if (elements.currentYear) {

    elements.currentYear.textContent =
        new Date().getFullYear();

}


/* ==========================================================
   13. MANEJO DE IMÁGENES QUE NO CARGUEN
   ----------------------------------------------------------
   Si alguna imagen falla, añadimos una clase especial que
   permite al CSS mostrarla de una manera más adecuada.
   ========================================================== */

document
    .querySelectorAll('img')
    .forEach(
        (image) => {

            image.addEventListener(
                'error',
                () => {

                    image.classList.add(
                        'image-error'
                    );

                }
            );

        }
    );


/* ==========================================================
   14. MENSAJE DE DESARROLLO
   ==========================================================
   Este mensaje aparece únicamente en la consola del navegador
   y sirve para confirmar que JavaScript está funcionando.
   ========================================================== */

console.info(
    '[Café Los Cedros] Página cargada correctamente.'
);

console.info(
    '[Café Los Cedros] Recuerda configurar BRAND_CONFIG para WhatsApp y otras redes.'
);