const raiz_finanzas = './paginas/finanzas';
const raiz_gestion_tiempo = './paginas/Gestion de tiempo';

const direcciones = {
 
    finanzas_DV: {
        index: `${raiz_finanzas}/index`,

        registros: {
            index: './paginas/finanzas/registros/index',
            add: 'paginas/finanzas/registros/add_registros',
            add_ingresos: 'paginas/finanzas/registros/add_registros_ingresos',
            // add_gastos: 'paginas/finanzas/registros/add/gastos'
            imprimir_excel:'/finanzas/registros/imprimir_excel'
            
        },

        gastos: {
            index:'.paginas/finanzas/gastos/index'
        }
        
    },



    gestion_tiempo_DV: {
        index: './paginas/Gestion de tiempo/index',

        metas:{
            index: `${raiz_gestion_tiempo}/metas/index`,
            add: `${raiz_gestion_tiempo}/metas/metas_add`
        },

        objetivos:{
            add: `${raiz_gestion_tiempo}/metas/objetivos/add`
        },

        tareas:{
            add: `${raiz_gestion_tiempo}/metas/tareas/add`
        },
    }
    
};

    


module.exports = direcciones;