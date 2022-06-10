// SPDX-License-Identifier: GLP-3.0

// Version para un solo Usuario

pragma solidity >=0.7.0 <0.9.0;

contract Habitos {

    address author;
    enum State {Empezado, Finalizado}
    enum CumplioReto {NoSupero, Supero}
    enum CobroPremio {NoCobrado, Cobrado}
    uint montoReto = 1000000000000000000; //monto para ingresar al reto de 1 Celo (o Eth)
    uint public totalRetos = 0;

    mapping (address => uint[]) retosPorUser;
    
    constructor() {
        author = msg.sender;
    }

   struct User {
        address wallet;
        CumplioReto cumplioReto;
        CobroPremio cobroPremio;
        bool[3] dias;
    }
    
    struct Reto {
        uint id;
        string name;
        User user;
        uint deposito;
        State estado;
        uint fechaComienzo;
    }

    Reto[] public retos;

    //evento crear nuevo reto
    event RetoCreado(
        uint id,
        address user1
    );
        
    //Evento Notifica idReto y si es o no Ganador una finalizado los dias.
    event NotificacionDeGanador(
        uint indexReto,
        CumplioReto resultado
    );

    event AnunciarPremioCobrado (uint indexReto, address wallet);

    modifier onlyUser(uint indexReto) {
        require(msg.sender == retos[indexReto].user.wallet, "No es el Usuario del reto");
        _;
    }

    modifier onlyRetoEmpezado(uint indexReto) {
        require(retos[indexReto].estado == State.Empezado, "Este reto no esta en vigencia");
        _;
    }

    modifier onlyRetoFinalizado(uint indexReto) {
        require(retos[indexReto].estado == State.Finalizado , "El reto todavia no ha finalizado");
        _;
    }

    // Crear un reto por un Usuario
    function crearReto(string memory _name) payable public {
        require(msg.value == montoReto, "El monto depositado no es el correcto, se requiere 1 Celo");
        Reto memory nuevoReto = Reto(
            totalRetos,                  // id del reto
            _name,                      // Nombre del reto
            User(msg.sender, CumplioReto.NoSupero, CobroPremio.NoCobrado ,[false, false, false]),  //datos del User
            msg.value,            // Cantidad de Eth
            State.Empezado,        // Estado
            block.timestamp        // Fecha de Comienzo
            );
        retos.push(nuevoReto);
        emit RetoCreado(totalRetos, msg.sender);
        retosPorUser[msg.sender].push(totalRetos);
        totalRetos+=1;
    }

  // De prueba puse un reto cada minuto, durante 3 minutos.
    function completarRetoDiario(uint indexReto) public onlyRetoEmpezado(indexReto) onlyUser(indexReto) {
        uint dia = calcularDia(indexReto);
        require(dia < 3, "Ya termino el tiempo del reto de 3 dias");
        require(retos[indexReto].user.dias[dia] == false, "Ya se cumplio el reto del dia de hoy");
        retos[indexReto].user.dias[dia] = true;  
    }

    function calcularDia(uint indexReto) internal onlyRetoEmpezado(indexReto) view returns(uint) {
        uint diasTranscurridos = (block.timestamp - retos[indexReto].fechaComienzo) / (1 minutes);
        return diasTranscurridos;
    }

    function finalizarReto(uint indexReto) public onlyUser(indexReto) onlyRetoEmpezado(indexReto) {
        require(calcularDia(indexReto) > 2, "Todavia no transcurrio el tiempo total");
        retos[indexReto].estado = State.Finalizado;
        calcularGanador(indexReto);
        if (retos[indexReto].user.cumplioReto == CumplioReto.NoSupero){
            delRetoInactivoUser(indexReto);
        }
    }

    function getRetosActivosPorUser() public view returns(uint[] memory){
        return retosPorUser[msg.sender];
    }

    function delRetoInactivoUser(uint indexReto) internal {
        uint[] storage arreglo = retosPorUser[msg.sender];
        for (uint i=0; i < arreglo.length; i++) {
            if (arreglo[i] == indexReto) {
                arreglo[i] = arreglo[arreglo.length-1];
                arreglo.pop();
            }
        }
        retosPorUser[msg.sender] = arreglo;
    }

    function calcularGanador(uint indexReto) internal {
        retos[indexReto].user.cumplioReto = CumplioReto.Supero;
        for (uint i=0; i < 3; i++) {
            if (!retos[indexReto].user.dias[i]) {
                retos[indexReto].user.cumplioReto = CumplioReto.NoSupero;
            }
        }                  
        emit NotificacionDeGanador(
            indexReto,
            retos[indexReto].user.cumplioReto
            );
    }

  //Claimear premio
    function reclamarPremio2(uint indexReto) public onlyUser(indexReto) onlyRetoFinalizado(indexReto) {
        require (retos[indexReto].user.cumplioReto == CumplioReto.Supero, "El reto no fue superado por este usuario");
        require (retos[indexReto].user.cobroPremio == CobroPremio.NoCobrado, "Este premio ya fue cobrado por este usuario");
            payable(retos[indexReto].user.wallet).transfer(montoReto);
            retos[indexReto].deposito -= montoReto;
            retos[indexReto].user.cobroPremio = CobroPremio.Cobrado; // se marca cobrado al User
            delRetoInactivoUser(indexReto);
            emit AnunciarPremioCobrado(indexReto, msg.sender); // se anuncia premio cobrado por el User
        }
}