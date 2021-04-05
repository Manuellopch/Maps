class UI {
     constructor() {

          //instanciar la API

          this.api = new API();

          //crear los Makers con Layer Group

          this.markers = new L.LayerGroup();
 
          // Iniciar el mapa

          this.mapa = this.inicializarMapa();
 
     }
     
     inicializarMapa() {

          // Inicializar y obtener la propiedad del mapa

          const map = L.map('mapa').setView([19.390519, -99.3739778], 6);
          const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
          L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; ' + enlaceMapa + ' Contributors',
              maxZoom: 18,
              }).addTo(map);
          return map;
 
     }

     MostrarMapa(){
          this.api.obtenerDatos()
               .then(datos => {

                    const resultado = datos.respuestaJSON.results;

                    //ejecuta la funcion para mostrar los Pines
                    this.mostrarPines(resultado)

               });
     }

     mostrarPines(datos){

          //Limpiar los Makers

          this.markers.clearLayers();

          //recorrer los establecimientos

          datos.forEach(dato =>{

               //destructuring
               const {latitude, longitude, calle, regular, premium} = dato;

               //crear un nuevo POPUP

               const opcionesPopup = L.popup()
                    .setContent(`<p>Calle: ${calle}</p>
                                 <p><b>Regular:</b> $ ${regular}</p>
                                 <p><b>Premium:</b> $ ${premium}</p>
                    
                    `); 

               //agregar el PIN

               const marker = new L.marker([

                    parseFloat(latitude),
                    parseFloat(longitude)

               ]).bindPopup(opcionesPopup)

               this.markers.addLayer(marker);

          });

          this.markers.addTo(this.mapa);

     }

     //buscador

     obtenerSugerencias(busqueda){
          this.api.obtenerDatos()
               .then(datos=>{

                    const resultado = datos.respuestaJSON.results;

                    //enviar el JSON y la busqueda para el filtrado

                    this.filtrarSugerencias(resultado, busqueda);


               })
     }

     //filtra las sugerencias en base al input

     filtrarSugerencias(resultado, busqueda){

          //filtrar con filter

        const filtro = resultado.filter(filtro => filtro.calle.indexOf(busqueda) !== -1);

          //mostrar los pines

          this.mostrarPines(filtro);
          
     }
 }