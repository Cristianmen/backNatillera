class validar {

    constructor(){ }

    exprecionLetras(x) {
    
    const cadena = x
    const result = /^([a-zA-Z| ])*$/.test(cadena);
    console.log(result)
    return result;

  }

  exprecionNumero(x) {
    
    const cadena = x
    const result = /^([0-9| ])*$/.test(cadena);
    console.log(result)
    return result;

  }

  exprecionHora(x) {
    
    const cadena = x
    const result = /^([0-9]{1,3}[:][0-9]{1,3})*$/.test(cadena);
    console.log(result)
    return result;

  }

  exprecionHora(x) {
    
    const cadena = x
    const result = /^([0-9]{1,3}[:][0-9]{1,3})*$/.test(cadena);
    console.log(result)
    return result;

  }

  exprecionNumeroOLetras(x) {
    
    const cadena = x
    const result = /^([a-zA-Z0-9| |?|¿])*$/.test(cadena);
    console.log(result)
    return result;

  }

  exprecionCorreo(x){
    const cadena = x
    const result =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(cadena);
    console.log(result)
    return result;
  }

  exprecionContraseña(x){
    const cadena = x
    const result =/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$+/.test(cadena);
    console.log(result)
    return result;
  }

  exprecionFecha(x){
    const cadena = x
    const result =/^([0-9]{0,4}[/|-][0-9]{0,2}[/|-][0-9]{0,2})$/.test(cadena);
    console.log(result)
    return result;
  }

}
module.exports= validar;