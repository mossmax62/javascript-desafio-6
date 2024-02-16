const endpoint = 'https://mindicador.cl/api';
const boton = document.getElementById('convertir');
const labelResultado = document.getElementById('resultado');
const ctx = document.getElementById('myChart');
const monedaSelect = document.getElementById('moneda');
const pesosInput = document.getElementById('pesos');
let myChart;

const getIndicadoresHoy = async () => {
    const response = await fetch(endpoint);
    return await response.json();
}

const calcular = (valor, moneda, indicadorHoy) => {
    return valor / indicadorHoy[moneda].valor;
}

const render = (indicadores, pesos) => {
    const moneda = monedaSelect.value;
    const resultado = calcular(pesos, moneda.toLowerCase(), indicadores);
    labelResultado.innerHTML = `Valor en ${moneda.toUpperCase()} es: ${resultado}`;
}

const getDataForChart = async (moneda) => {
    const response = await fetch(`${endpoint}/${moneda}`);
    const valores = await response.json();
    const labels = valores.serie.map(item => formatearFecha(item.fecha));
    const data = valores.serie.map(item => +item.valor);
    const datasets = [{
        label: valores.nombre,
        borderColor: 'rgb(255, 99, 132)',
        data,
    }];
    return { labels, datasets };
}

const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const renderChart = async () => {
    const moneda = monedaSelect.value;
    const data = await getDataForChart(moneda);
    ctx.style.backgroundColor = 'black';
    const config = {
        type: 'line',
        data: data
    };
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, config);
}

const main = async () => {
    try {
        const indicadores = await getIndicadoresHoy();
        boton.addEventListener('click', async () => {
            const pesos = pesosInput.value;
            render(indicadores, pesos);
            await renderChart();
        });
    } catch (error) {
        console.error('==>', error);
    }
}

main();
