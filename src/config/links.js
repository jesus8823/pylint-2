const GT = `/gestion_tiempo`


const links = {
    home_links: {
        inicio: '/'
    },

    finanzas_links: {
        inicio: '/finanzas',

        registros: {
            inicio: '/finanzas/registros',
            imprimir_excel:'/finanzas/registros/imprimir_excel',
            add: '/finanzas/registros/add',
            add_ingresos: '/finanzas/registros/add/ingresos',
            add_gastos: '/finanzas/registros/add/gastos'
        },
    },



    gestion_tiempo_links: {
        
        metas: {
            add: `${GT}/metas/add`
        },
        objetivos:{
            add: `${GT}/metas/objetivos/add`
        },
        tareas:{
            add: `${GT}/metas/tareas/add`
        },

    }    
        
    
    
};

module.exports = links;