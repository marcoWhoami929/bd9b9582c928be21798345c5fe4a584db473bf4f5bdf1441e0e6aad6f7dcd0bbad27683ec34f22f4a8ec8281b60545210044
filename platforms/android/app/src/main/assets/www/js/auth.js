$(document).ready(function () {
  //var url = "http://localhost/DEKKERADMIN/encuestaAuth.php?callback=?";
  var url =
    "https://sanfranciscodekkerlab.com/matriz/encuestaAuth.php?callback=?";

  //Login Function
  $("#login").click(function () {
    var email = $("#email").val();
    var password = $("#password").val();
    var dataString = "email=" + email + "&password=" + password + "&login=";
    if (($.trim(email).length > 0) & ($.trim(password).length > 0)) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
          $("#login").html("Conectando...");
        },
        success: function (data) {
          if (data != "failed") {
            localStorage.login = "true";
            localStorage.email = email;
            // Obteniendo todas las claves del JSON
            var json = data;
            for (var clave in json) {
              localStorage.idCliente = JSON.parse(json).idCliente;
            }

            swal({
              title: "BLITZ",
              text: "Bienvenido",
              icon: "info",
              button: true,
              dangerMode: false,
            }).then((willDelete) => {
              if (willDelete) {
                window.location.href = "index.html";
              }
            });
          } else if (data == "failed") {
            swal("Algo Salio Mal", "verifique su correo o contraseña", "error");
            //alert("Error verifique su correo o contraseña");
            $("#login").html("Acceder");
          }
        },
      });
    } else {
      swal("Llenar Todos los Campos...", "", "info");
    }
    return false;
  });

  $("#guardarUbicacion").click(function () {
    var idCliente = localStorage.idCliente;
    var dataString = "idCliente=" + idCliente + "&consultarId=";
    if ($.trim(idCliente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
          $("#btnEstatus").val("Verificando...");
        },
        success: function (data) {
          if (data != "failed") {
            //console.log("Ultimo Numero Obtenido");
            localStorage.idEncuesta = data;

            //console.log(localStorage.idEncuesta);
            var json = localStorage.idEncuesta;
            var types = JSON.parse(json);

            for (x = 0; x < types.length; x++) {
              var siguienteId = types[x].idEncuesta;
              var latitudBd = types[x].latitudBd;
              var longitudBd = types[x].longitudBd;

              localStorage.folioEncuesta = types[x].idEncuesta;

              var latitud = localStorage.getItem("latitud");
              var longitud = localStorage.getItem("longitud");

              if (latitudBd == latitud && longitudBd == longitud) {
                swal({
                  title: "Upss..",
                  text: "Ya existen las coordenadas",
                  icon: "warning",
                  buttons: {
                    cancel: "Minimizar Ventana",
                    default: "Continuar Encuesta!",
                  },
                  dangerMode: false,
                }).then((willDelete) => {
                  if (willDelete) {
                    var identificador = "0101";
                    var dataString =
                      "identificador=" + identificador + "&listarProveedores=";
                    if ($.trim(identificador).length > 0) {
                      $.ajax({
                        type: "POST",
                        url: url,
                        data: dataString,
                        crossDomain: true,
                        cache: false,
                        beforeSend: function () {},
                        success: function (data) {
                          if (data != "failed") {
                            localStorage.listadoProveedores = data;
                            window.location.href = "encuesta.html";
                          } else if (data == "failed") {
                            alert("No Hay Conexion...");
                          }
                        },
                      });
                    } else {
                      alert("Ha ocurrido un Error.");
                    }
                    return false;
                  } else {
                  }
                });
              } else {
                var dataString =
                  "idCliente=" +
                  idCliente +
                  "&siguienteId=" +
                  siguienteId +
                  "&latitud=" +
                  latitud +
                  "&longitud=" +
                  longitud +
                  "&guardarCoordenadas=";
                if (
                  ($.trim(idCliente).length > 0) &
                  ($.trim(siguienteId).length > 0) &
                  ($.trim(latitud).length > 0) &
                  ($.trim(longitud).length > 0)
                ) {
                  $.ajax({
                    type: "POST",
                    url: url,
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                      if (data == "success") {
                        var identificador = "0101";
                        var dataString =
                          "identificador=" +
                          identificador +
                          "&listarProveedores=";
                        if ($.trim(identificador).length > 0) {
                          $.ajax({
                            type: "POST",
                            url: url,
                            data: dataString,
                            crossDomain: true,
                            cache: false,
                            beforeSend: function () {},
                            success: function (data) {
                              if (data != "failed") {
                                localStorage.listadoProveedores = data;
                                window.location.href = "encuesta.html";
                              } else if (data == "failed") {
                                alert("No Hay Conexion...");
                              }
                            },
                          });
                        } else {
                          alert("Ha ocurrido un Error.");
                        }
                        return false;
                      } else if ((data = "failed")) {
                        console.log("Algo salio Mal");
                      }
                    },
                  });
                } else {
                }
                return false;
              }
            }
          } else if (data == "failed") {
            //window.location.href = "estatus.html";
            //alert("No tiene solicitudes realizadas.");
            //swal("Upss", "No tiene solicitudes realizadas.", "info");
            console.log(" No hay Ultimo Numero");
          }
        },
      });
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

    /**/
  });
  /*=======================================================
    =            FUNCION PARA FINALIZAR ENCUESTA            =
    =======================================================*/
  $("#finalizarEncuesta").on("click", function () {
    swal({
      title: "¿Cuál es el motivo por el que se cancela la encuesta?",
      text: "",
      icon: "warning",
      buttons: {
        noEncuestado: {
          text: "No Quiso Ser Encuestado",
          value: "noEncuestado",
        },
        catch: {
          text: "Cliente No Encontrado",
          value: "catch",
        },
        cerrado: {
          text: "El Taller Estuvo Cerrado",
          value: "cerrado",
        },
      },
      dangerMode: true,
    }).then((value) => {
      switch (value) {
        case "noEncuestado":
          var motivoFinalizacion = "No Quiso Ser Encuestado";
          var folioEncuesta = localStorage.getItem("folioEncuesta");
          var dataString =
            "motivoFinalizacion=" +
            motivoFinalizacion +
            "&folioEncuesta=" +
            folioEncuesta +
            "&finalizacionEncuesta=";

          $.ajax({
            type: "POST",
            url: url,
            data: dataString,
            crossDomain: true,
            cache: false,
            beforeSend: function () {},
            success: function (data) {
              if (data != "failed") {
                swal({
                  title: "Encuesta Finalizada",
                  text: "",
                  icon: "success",
                  button: true,
                  dangerMode: false,
                }).then((willDelete) => {
                  if (willDelete) {
                    localStorage.removeItem("masking");
                    localStorage.removeItem("LongitudDireccion");
                    localStorage.removeItem("esmalte");
                    localStorage.removeItem("longitud");
                    localStorage.removeItem("lija");
                    localStorage.removeItem("baseColor");
                    localStorage.removeItem("pistola");
                    localStorage.removeItem("LatitudDireccion");
                    localStorage.removeItem("transparente");
                    localStorage.removeItem("latitud");
                    localStorage.removeItem("idEncuesta");
                    localStorage.removeItem("folioEncuesta");
                    localStorage.removeItem("undefined");
                    localStorage.removeItem("listadoProveedores");

                    var arreglo = localStorage.getItem("arrayInputs");
                    var arregloInputs = JSON.parse(arreglo);

                    for (var i = 0; i < arregloInputs.length; i++) {
                      localStorage.removeItem(arregloInputs[i]);
                    }

                    var arreglo2 = localStorage.getItem("arraySelects");
                    var arregloSelects = JSON.parse(arreglo2);

                    for (var i = 0; i < arregloSelects.length; i++) {
                      localStorage.removeItem(arregloSelects[i]);
                    }

                    window.location.href = "index.html";
                  }
                });
              } else if (data == "failed") {
                swal("Algo Salio Mal", "No se pudo finalizar", "error");
              }
            },
          });
          break;

        case "catch":
          var motivoFinalizacion = "El Taller Estuvo Cerrado";
          var folioEncuesta = localStorage.getItem("folioEncuesta");
          var dataString =
            "motivoFinalizacion=" +
            motivoFinalizacion +
            "&folioEncuesta=" +
            folioEncuesta +
            "&finalizacionEncuesta=";

          $.ajax({
            type: "POST",
            url: url,
            data: dataString,
            crossDomain: true,
            cache: false,
            beforeSend: function () {},
            success: function (data) {
              if (data != "failed") {
                swal({
                  title: "Encuesta Finalizada",
                  text: "",
                  icon: "success",
                  button: true,
                  dangerMode: false,
                }).then((willDelete) => {
                  if (willDelete) {
                    localStorage.removeItem("masking");
                    localStorage.removeItem("LongitudDireccion");
                    localStorage.removeItem("esmalte");
                    localStorage.removeItem("longitud");
                    localStorage.removeItem("lija");
                    localStorage.removeItem("baseColor");
                    localStorage.removeItem("pistola");
                    localStorage.removeItem("LatitudDireccion");
                    localStorage.removeItem("transparente");
                    localStorage.removeItem("latitud");
                    localStorage.removeItem("idEncuesta");
                    localStorage.removeItem("folioEncuesta");
                    localStorage.removeItem("undefined");
                    localStorage.removeItem("listadoProveedores");

                    var arreglo = localStorage.getItem("arrayInputs");
                    var arregloInputs = JSON.parse(arreglo);

                    for (var i = 0; i < arregloInputs.length; i++) {
                      localStorage.removeItem(arregloInputs[i]);
                    }

                    var arreglo2 = localStorage.getItem("arraySelects");
                    var arregloSelects = JSON.parse(arreglo2);

                    for (var i = 0; i < arregloSelects.length; i++) {
                      localStorage.removeItem(arregloSelects[i]);
                    }

                    window.location.href = "index.html";
                  }
                });
              } else if (data == "failed") {
                swal("Algo Salio Mal", "No se pudo finalizar", "error");
              }
            },
          });
          break;

        case "cerrado":
          var motivoFinalizacion = "El Taller Estuvo Cerrado";
          var folioEncuesta = localStorage.getItem("folioEncuesta");
          var dataString =
            "motivoFinalizacion=" +
            motivoFinalizacion +
            "&folioEncuesta=" +
            folioEncuesta +
            "&finalizacionEncuesta=";

          $.ajax({
            type: "POST",
            url: url,
            data: dataString,
            crossDomain: true,
            cache: false,
            beforeSend: function () {},
            success: function (data) {
              if (data != "failed") {
                swal({
                  title: "Encuesta Finalizada",
                  text: "",
                  icon: "success",
                  button: true,
                  dangerMode: false,
                }).then((willDelete) => {
                  if (willDelete) {
                    localStorage.removeItem("masking");
                    localStorage.removeItem("LongitudDireccion");
                    localStorage.removeItem("esmalte");
                    localStorage.removeItem("longitud");
                    localStorage.removeItem("lija");
                    localStorage.removeItem("baseColor");
                    localStorage.removeItem("pistola");
                    localStorage.removeItem("LatitudDireccion");
                    localStorage.removeItem("transparente");
                    localStorage.removeItem("latitud");
                    localStorage.removeItem("idEncuesta");
                    localStorage.removeItem("folioEncuesta");
                    localStorage.removeItem("undefined");
                    localStorage.removeItem("listadoProveedores");

                    var arreglo = localStorage.getItem("arrayInputs");
                    var arregloInputs = JSON.parse(arreglo);

                    for (var i = 0; i < arregloInputs.length; i++) {
                      localStorage.removeItem(arregloInputs[i]);
                    }

                    var arreglo2 = localStorage.getItem("arraySelects");
                    var arregloSelects = JSON.parse(arreglo2);

                    for (var i = 0; i < arregloSelects.length; i++) {
                      localStorage.removeItem(arregloSelects[i]);
                    }

                    window.location.href = "index.html";
                  }
                });
              } else if (data == "failed") {
                swal("Algo Salio Mal", "No se pudo finalizar", "error");
              }
            },
          });
          break;
        default:
        //swal("Nada!");
      }
    });
  });

  /*=====  End of FUNCION PARA FINALIZAR ENCUESTA  ======*/

  /**
   * GUARADAR DATROS DE LA ENCUESTA
   */

  $("#guardarDatos").click(function () {
    var idCliente = localStorage.idCliente;

    var latitud = localStorage.getItem("latitud");
    var longitud = localStorage.getItem("longitud");

    var dataString =
      "idCliente=" +
      idCliente +
      "&latitud=" +
      latitud +
      "&longitud=" +
      longitud +
      "&consultarIdEncuesta=";
    if (
      ($.trim(idCliente).length > 0) &
      ($.trim(idCliente).length > 0) &
      ($.trim(idCliente).length > 0)
    ) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
          //$("#btnEstatus").val('Verificando...');
        },
        success: function (data) {
          if (data != "failed") {
            var json = data;
            var types = JSON.parse(json);

            for (x = 0; x < types.length; x++) {
              var idEncuestaConsultado = types[x].id;

              var idCliente = localStorage.idCliente;
              //console.log("id Encuesta: ",idEncuestaConsultado);

              var nameTaller = $("#nombreTaller").val();
              var nameCliente = $("#nombreCliente").val();
              var calle = $("#route").val();
              var noInterior = $("#street_number").val();
              var colonia = $("#sublocality_level_1").val();
              var estado = $("#administrative_area_level_1").val();
              var ciudad = $("#locality").val();
              var cp = $("#postal_code").val();
              var telefono = $("#telefono").val();
              var celular = $("#celular").val();
              var email = $("#correoClient").val();
              var facebook = $("#facebook").val();
              var reparacionesMensuales = $("#reparacionesMensuales").val();
              var igualadosSemanales = $("#igualadosSemanales").val();
              var calidadIgualado = $("#calidadIgualado").val();
              var m2Area = $("#m2Area").val();
              var noTrabajadores = $("#noTrabajadores").val();

              var horaInicio = $("#horaInicio").val();
              var horaFin = $("#horaFin").val();
              var horarioLV = horaInicio + "-" + horaFin;

              var horaInicioSab = $("#horaInicioSab").val();
              var horaFinSab = $("#horaFinSab").val();
              var horarioSab = horaInicioSab + "-" + horaFinSab;
              //console.log("Horario de L-N: ",horarioLV, "Horario de Sabado: ",horarioSab);

              var satisfecho = $("#satisfecho").val();
              var porQue = $("#porQue").val();

              var proveedor = $("#proveedor").val();
              var domicilioReferencia = $("#domicilioReferencia").val();

              var proveedor2 = $("#proveedor2").val();
              var domicilioReferencia2 = $("#domicilioReferencia2").val();

              var formaPago = $("#formaPago").val();

              var lineaCredito = $("#lineaCredito").val();
              var tiempoCredito = $("#tiempoCredito").val();
              var antiguedadTaller = $("#antiguedadTaller").val();
              var lineaBaseColor = JSON.parse(
                localStorage.getItem("baseColor")
              );
              var esmaltes = JSON.parse(localStorage.getItem("esmalte"));
              var transparentes = JSON.parse(
                localStorage.getItem("transparente")
              );
              var pistolas = JSON.parse(localStorage.getItem("pistola"));
              var lijas = JSON.parse(localStorage.getItem("lija"));
              var maskings = JSON.parse(localStorage.getItem("masking"));

              var inversionSemanal = $("#inversionSemanal").val();
              var productosAddProveedor = $("#productosAddProveedor").val();
              var comentariosMejora = $("#comentariosMejora").val();

              var direccion =
                calle +
                "," +
                noInterior +
                "," +
                colonia +
                "," +
                estado +
                "," +
                ciudad +
                "," +
                cp;

              var tipoEncuesta = $("#tipoEncuesta").val();
              var dataString =
                "idCliente=" +
                idCliente +
                "&idEncuestaConsultado=" +
                idEncuestaConsultado +
                "&estado=" +
                estado +
                "&nameTaller=" +
                nameTaller +
                "&nameCliente=" +
                nameCliente +
                "&telefono=" +
                telefono +
                "&celular=" +
                celular +
                "&email=" +
                email +
                "&facebook=" +
                facebook +
                "&reparacionesMensuales=" +
                reparacionesMensuales +
                "&igualadosSemanales=" +
                igualadosSemanales +
                "&calidadIgualado=" +
                calidadIgualado +
                "&m2Area=" +
                m2Area +
                "&noTrabajadores=" +
                noTrabajadores +
                "&horarioLV=" +
                horarioLV +
                "&horarioSab=" +
                horarioSab +
                "&satisfecho=" +
                satisfecho +
                "&porQue=" +
                porQue +
                "&direccion=" +
                direccion +
                "&proveedor=" +
                proveedor +
                "&domicilioReferencia=" +
                domicilioReferencia +
                "&proveedor2=" +
                proveedor2 +
                "&domicilioReferencia2=" +
                domicilioReferencia2 +
                "&formaPago=" +
                formaPago +
                "&lineaCredito=" +
                lineaCredito +
                "&tiempoCredito=" +
                tiempoCredito +
                "&antiguedadTaller=" +
                antiguedadTaller +
                "&lineaBaseColor=" +
                lineaBaseColor +
                "&esmaltes=" +
                esmaltes +
                "&transparentes=" +
                transparentes +
                "&pistolas=" +
                pistolas +
                "&lijas=" +
                lijas +
                "&maskings=" +
                maskings +
                "&inversionSemanal=" +
                inversionSemanal +
                "&productosAddProveedor=" +
                productosAddProveedor +
                "&comentariosMejora=" +
                comentariosMejora +
                "&tipoEncuesta=" +
                tipoEncuesta +
                "&guardarDatosEncuesta=";
              if (
                ($.trim(idCliente).length > 0) &
                ($.trim(idEncuestaConsultado).length > 0) &
                ($.trim(estado).length > 0) &
                ($.trim(nameTaller).length > 0) &
                ($.trim(nameCliente).length > 0) &
                ($.trim(reparacionesMensuales).length > 0) &
                ($.trim(igualadosSemanales).length > 0) &
                ($.trim(calidadIgualado).length > 0) &
                ($.trim(m2Area).length > 0) &
                ($.trim(noTrabajadores).length > 0) &
                ($.trim(satisfecho).length > 0) &
                ($.trim(formaPago).length > 0) &
                ($.trim(inversionSemanal).length > 0)
              ) {
                $.ajax({
                  type: "POST",
                  url: url,
                  data: dataString,
                  crossDomain: true,
                  cache: false,
                  beforeSend: function () {},
                  success: function (data) {
                    if (data == "success") {
                      swal({
                        title: "Éxito",
                        text: "Datos guardados correctamente.",
                        icon: "success",
                        button: true,
                        dangerMode: false,
                      }).then((willDelete) => {
                        if (willDelete) {
                          localStorage.removeItem("masking");
                          localStorage.removeItem("LongitudDireccion");
                          localStorage.removeItem("esmalte");
                          localStorage.removeItem("longitud");
                          localStorage.removeItem("lija");
                          localStorage.removeItem("baseColor");
                          localStorage.removeItem("pistola");
                          localStorage.removeItem("LatitudDireccion");
                          localStorage.removeItem("transparente");
                          localStorage.removeItem("latitud");
                          localStorage.removeItem("idEncuesta");
                          localStorage.removeItem("folioEncuesta");
                          localStorage.removeItem("undefined");
                          localStorage.removeItem("listadoProveedores");

                          var arreglo = localStorage.getItem("arrayInputs");
                          var arregloInputs = JSON.parse(arreglo);

                          for (var i = 0; i < arregloInputs.length; i++) {
                            localStorage.removeItem(arregloInputs[i]);
                          }

                          var arreglo2 = localStorage.getItem("arraySelects");
                          var arregloSelects = JSON.parse(arreglo2);

                          for (var i = 0; i < arregloSelects.length; i++) {
                            localStorage.removeItem(arregloSelects[i]);
                          }

                          window.location.href = "index.html";
                        }
                      });
                    } else if ((data = "failed")) {
                      swal("Algo salio mal.", "", "info");
                    }
                  },
                });
              } else {
                swal("Llenar Todos los Campos...*", "", "info");
              }
              return false;
            }
          } else if (data == "failed") {
            console.log(" No hay Ultimo Numero");
          }
        },
      });
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;
    /*
     */
  });

  $("#contenedor").on("click", ".btnVerProductos", function () {
    var idSubcategoria = $(this).attr("idSubCategorias");
    var nombreSubcategoria = $(this).attr("nombreSubcategoria");
    localStorage.nombreSubcategoria = nombreSubcategoria;
  });
  /**************************************************************** */
  $("#verProveedoresCercanos").on("click", function () {
    var latitud = localStorage.latitudMaps;
    var longitud = localStorage.longitudMaps;
    var dataString =
      "latitud=" +
      latitud +
      "&longitud=" +
      longitud +
      "&localizacionProveedores=";
    if (($.trim(latitud).length > 0) & ($.trim(longitud).length > 0)) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
          $("#verProveedoresCercanos").html("LOCALIZANDO...");
        },
        success: function (data) {
          if (data != "failed") {
            var json = data;

            localStorage.localizadorProveedores = json;
            window.location.href = "proveedoresCercanos.html";
          } else if (data == "failed") {
            swal("Algo Salio Mal", "Vuelve a intentarlo mas tarde", "error");
            //alert("Error verifique su correo o contraseña");
            $("#login").html("VER TIENDAS CERCANAS");
          }
        },
      });
    } else {
      swal("Tu ubicacion no pudo ser obtenida...", "", "info");
    }
    return false;
  });
  /**************************************************************** */
  $("#verProveedoresCercanosMapa").on("click", function () {
    window.location.href = "localizador.html";
  });
  /**************************************************************** */
  $("#nuevoProveedor").on("click", function () {
    window.location.href = "nuevo.html";
  });

  $("#actualizarProveedor").on("click", function () {
    var id = localStorage.editarId;
    var tienda = $("#editarTienda").val();
    var direccion = $("#editarDireccion").val();
    var latitud = $("#editarLatitud").val();
    var longitud = $("#editarLongitud").val();
    var dataString =
      "editarId=" +
      id +
      "&editarTienda=" +
      tienda +
      "&editarDireccion=" +
      direccion +
      "&editarLatitud=" +
      latitud +
      "&editarLongitud=" +
      longitud +
      "&actualizarDatosProveedor=";
    if (
      ($.trim(id).length > 0) &
      ($.trim(tienda).length > 0) &
      ($.trim(direccion).length > 0) &
      ($.trim(latitud).length > 0) &
      ($.trim(longitud).length > 0)
    ) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
          $("#actualizarProveedor").html("Actualizando...");
        },
        success: function (data) {
          if (data != "failed") {
            swal({
              title: "Exito",
              text: "Datos actualizados correctamente",
              icon: "success",
              button: true,
              dangerMode: false,
            }).then((willDelete) => {
              if (willDelete) {
                localStorage.removeItem("editarId");
                localStorage.removeItem("editarProveedor");
                localStorage.removeItem("editarDireccion");
                localStorage.removeItem("editarLatitud");
                localStorage.removeItem("editarLongitud");
                window.location.href = "index.html";
              }
            });
          } else if (data == "failed") {
            swal("Algo Salio Mal", "Vuelve a intentarlo mas tarde", "error");
            //alert("Error verifique su correo o contraseña");
            window.location.href = "proveedoresCercanos.html";
          }
        },
      });
    } else {
      swal("Existen datos incompletos...", "", "info");
    }
    return false;
  });
  $("#registrarNuevo").on("click", function () {
    var tienda = $("#tienda").val();
    var direccion = $("#direccion").val();
    var latitud = $("#latitud").val();
    var longitud = $("#longitud").val();
    var idCliente = localStorage.idCliente;
    var dataString =
      "tienda=" +
      tienda +
      "&direccion=" +
      direccion +
      "&latitud=" +
      latitud +
      "&longitud=" +
      longitud +
      "&idAgente=" +
      idCliente +
      "&nuevoProveedor=";
    if (
      ($.trim(tienda).length > 0) &
      ($.trim(direccion).length > 0) &
      ($.trim(latitud).length > 0) &
      ($.trim(longitud).length > 0)
    ) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
          $("#registrarNuevo").html("Guardando...");
        },
        success: function (data) {
          if (data != "failed") {
            swal({
              title: "Exito",
              text: "Registrado correctamente",
              icon: "success",
              button: true,
              dangerMode: false,
            }).then((willDelete) => {
              if (willDelete) {
                window.location.href = "index.html";
              }
            });
          } else if (data == "failed") {
            swal("Algo Salio Mal", "Vuelve a intentarlo mas tarde", "error");
            //alert("Error verifique su correo o contraseña");
            window.location.href = "proveedoresCercanos.html";
          }
        },
      });
    } else {
      swal("Existen datos incompletos...", "", "info");
    }
    return false;
  });
});

function obtenerDatosProveedor(id) {
  var dataString = "idProveedor=" + id + "&datosProveedor=";
  if ($.trim(id).length > 0) {
    $.ajax({
      type: "POST",
      url: "https://sanfranciscodekkerlab.com/matriz/encuestaAuth.php?callback=?",
      data: dataString,
      crossDomain: true,
      cache: false,
      beforeSend: function () {},
      success: function (data) {
        if (data != "failed") {
          var json = JSON.parse(data);
          localStorage.setItem("editarId", json[0]["id"]);
          localStorage.setItem("editarProveedor", json[0]["proveedor"]);
          localStorage.setItem("editarDireccion", json[0]["direccion"]);
          localStorage.setItem("editarLatitud", json[0]["latitud"]);
          localStorage.setItem("editarLongitud", json[0]["longitud"]);
          window.location.href = "editar.html";
        } else if (data == "failed") {
          swal("Algo Salio Mal", "Vuelve a intentarlo mas tarde", "error");

          window.location.href = "proveedoresCercanos.html";
        }
      },
    });
  } else {
    swal("La solicitud no pudo ser procesada...", "", "info");
  }
  return false;
}
