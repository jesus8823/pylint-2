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
        },

        negocios_empresas: {
            index: `${raiz_finanzas}/Negocios y Empresas/index`,
            add_empresa: `${raiz_finanzas}/Negocios y Empresas/add_empresa`
        }
        
    },



    gestion_tiempo_DV: {
        index: './paginas/Gestion de tiempo/index',

        actividad:{
            index: `${raiz_gestion_tiempo}/actividad/index`,
            edit: `${raiz_gestion_tiempo}/actividad/edit`,
            delete: `${raiz_gestion_tiempo}/actividad/delete`
        },

        horario:{
            todos: `${raiz_gestion_tiempo}/horario/index`,
            add:`${raiz_gestion_tiempo}/horario/horario_add`,
            individual: `${raiz_gestion_tiempo}/horario/horario_individual`,
            add_tarea_ind: `${raiz_gestion_tiempo}/horario/horario_individual_add`,
            edit_tarea_ind: `${raiz_gestion_tiempo}/horario/horario_individual_edit`
        },

        metas:{
            index: `${raiz_gestion_tiempo}/metas/index`,
            add: `${raiz_gestion_tiempo}/metas/metas_add`,
            edit: `${raiz_gestion_tiempo}/metas/metas_edit`,
            add_plazo: `${raiz_gestion_tiempo}/metas/metas_add_fecha_plazo`,
            edicion_masiva: `${raiz_gestion_tiempo}/metas/meta_edicion_masiva`
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