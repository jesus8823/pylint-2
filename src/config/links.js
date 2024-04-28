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
        }
    },

    gestion_tiempo_links: {

        horario: {
            index: `${GT}/horarios`,
            add: `${GT}/horarios/add`,
            individual: `${GT}/horario/individual`,
            add_tarea_ind: `${GT}/horario/individual/add`,
            edit_tarea_ind: `${GT}/horario/individual/edit`
        },
        
        metas: {
            add: `${GT}/metas/add`,
            edit: `${GT}/metas/edit`,
            add_fecha_inicio: `${GT}/metas/add/fecha_inicio`,
            add_fecha_fin: `${GT}/metas/add/fecha_fin`,
            add_fecha_plazo: `${GT}/metas/add/fecha_plazo`
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