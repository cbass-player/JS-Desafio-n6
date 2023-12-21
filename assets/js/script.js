//Definición de variables
const baseValue = document.getElementById('input');
const optionCurrency = document.getElementById('select-currency');
const btnExchange = document.getElementById('btn-exchange');
const output = document.getElementById('output');

// Consulta a la API y Conversión
const getExchange = async (currency, amount) => {
    try {
        const values = await fetch(`https://mindicador.cl/api/${currency}`);
        
        if(!values.ok) {
            throw new Error (`HTTP error, status: ${values.status}`)
        };

        const results = await values.json();
        const result = results.serie[0].valor;

        // Conversión
        const exchange = parseFloat(amount.value) / parseFloat(result);
        
        // Renderización
        if (currency === 'dolar') {
            output.innerHTML = 'Resultado: USD ' + exchange.toFixed(2)
        }
        else if (currency === 'euro') {
            output.innerHTML = 'Resultado: € ' + exchange.toFixed(2)
        }
        else {
            output.innerHTML = 'Resultado: UF ' + exchange.toFixed(2) 
        };

    } catch (error) {
        alert(error.message || 'Ocurrió un error')
    }
};

// Función que desencadena el proceso de cambio
btnExchange.addEventListener('click', () => {
    getExchange(optionCurrency.value, baseValue)
    renderGraph(optionCurrency.value)
    
});


//Gráfico: Generación de datos
const getSerie = async (currency) => {
    const values = await fetch(`https://mindicador.cl/api/${currency}`)
    const results = await values.json();

    const labels = results.serie.slice(0,10).reverse().map((fecha) => {
        return fecha.fecha.slice(0, -14)
    });
    const data = results.serie.slice(0,10).reverse().map((val) => {
        return val.valor
    });
    const datasets = [
        {label: 'Historial últimos 10 días',
        borderColor: "rgb(255, 99, 132)",
        data}
    ];

    console.log({labels, datasets});
    return {labels, datasets}
};

// Gráfico: Renderización del gráfico
async function renderGraph(valueCurrency) {
    const data = await getSerie(valueCurrency);
    const config = {
        type: 'line',
        data
    };
    const myChart = document.getElementById('myChart');
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
};


