const direcciones = {
 
    finanzas_DV: {
        index: '/paginas/finanzas/index',

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
    
};

module.exports = direcciones;