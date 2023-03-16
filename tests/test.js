fetch("test.html").then(res=>{
    console.log(res.text().then(res2=>{
        console.log(res2.replace("\r\n",""));
    }));
});