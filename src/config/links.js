const GT = `/gestion_tiempo`

const FNE = `/finanzas/negocios_empresas`


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

        negocios_empresas: {
            inicio: `${FNE}`,
            add_empresa: `${FNE}/empresa/add`
        }
    },

    gestion_tiempo_links: {
        actividad:{
            index:`${GT}/registro_actividades`,
            edit:`${GT}/registro_actividades/edit`,
            delete:`${GT}/registro_actividades/delete`
        },

        horario: {
            index: `${GT}/horarios`,
            add: `${GT}/horarios/add`,
            individual: `${GT}/horario/individual`,
            add_tarea_ind: `${GT}/horario/individual/add`,
            edit_tarea_ind: `${GT}/horario/individual/edit`,
            delet_tarea_ind: `${GT}/horario/individual/delet`,
            confirmar_tarea_ind: `${GT}/horario/individual/confir/tarea`,
            fallar_tarea_ind: `${GT}/horario/individual/confir_fallida/tarea`,
            desconfirmar_tarea_ind: `${GT}/horario/individual/desconfir/tarea`,
            confirmar_tarea_meta_ind:`${GT}/horario/individual/confir/tarea_meta`,
            desconfirmar_tarea_meta_ind:`${GT}/horario/individual/desconfir/tarea_meta`
        },
        
        metas: {
            add: `${GT}/metas/add`,
            edit: `${GT}/metas/edit`,
            add_fecha_inicio: `${GT}/metas/add/fecha_inicio`,
            add_fecha_fin: `${GT}/metas/add/fecha_fin`,
            add_fecha_plazo: `${GT}/metas/add/fecha_plazo`,
            edit_masivo: `${GT}/metas/edicion_masiva`
        },
        objetivos:{
            add: `${GT}/metas/objetivos/add`,
            edit: `${GT}/metas/objetivos/edit`,
            add_fecha_inicio: `${GT}/metas/objetivos/add/fecha_inicio`,
            add_fecha_fin: `${GT}/metas/objetivos/add/fecha_fin`,
            add_fecha_plazo: `${GT}/metas/objetivos/add/fecha_plazo`
        },
        tareas:{
            orden:`${GT}/metas/tareas/orden`,
            add: `${GT}/metas/tareas/add`,
            edit: `${GT}/metas/tareas/edit`,
            add_fecha_inicio: `${GT}/metas/tareas/add/fecha_inicio`,
            add_fecha_fin: `${GT}/metas/tareas/add/fecha_fin`,
            add_fecha_plazo: `${GT}/metas/tareas/add/fecha_plazo`
        },

    }
}

module.exports = links;