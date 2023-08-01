async function getData(){
    const data = await fetch('/public/json/projects.json')
    console.log(data.json());
}

getData()