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
            add: `${raiz_gestion_tiempo}/metas/metas_add`,
            edit: `${raiz_gestion_tiempo}/metas/metas_edit`,
            add_plazo: `${raiz_gestion_tiempo}/metas/metas_add_fecha_plazo`
        },

        objetivos:{
            add: `${raiz_gestion_tiempo}/metas/objetivos/add`,
            edit: `${raiz_gestion_tiempo}/metas/objetivos/objetivos_edit`,
            add_plazo: `${raiz_gestion_tiempo}/metas/objetivos/objetivos_add_fecha_plazo`
            

        },

        tareas:{
            add: `${raiz_gestion_tiempo}/metas/tareas/add`,
            edit: `${raiz_gestion_tiempo}/metas/tareas/tareas_edit`,
            add_plazo: `${raiz_gestion_tiempo}/metas/tareas/tareas_add_fecha_plazo`,
            orden: `${raiz_gestion_tiempo}/metas/tareas/orden`

        },
    }
    
};

    


module.exports = direcciones;