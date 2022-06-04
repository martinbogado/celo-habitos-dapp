// SPDX-License-Identifier: GLP-3.0

pragma solidity >=0.7.0 <0.9.0;

//import "@openzeppelin/contracts/access/Ownable.sol";

contract Habitos {

    address author;
    enum State {Abierto, Empezado, Finalizado, Cerrado}
    enum CumplioReto {SuperoUnico, NoSupero, SuperaronAmbos}
    enum CobroPremio {NoCobrado, Cobrado}
    uint montoRetoPorUser = 1000000000000000000; //monto para ingresar al reto de 1 Celo (o Eth)
    
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

        User user1;
        User user2;

        uint montoTotalDepositado;
        State estado;
        uint fechaComienzo;
    }

    Reto[] public retos;

    //evento crear nuevo reto
    event RetoCreado(
        uint id,
        address user1,
        address user2
    );

    //Evento Notifica Ganador una vez finalizado los dias.
    event NotificacionDeGanador(
        CumplioReto user1Gano,
        CumplioReto user2Gano
        );

    event RetoAnulado(uint id); 

    event RetoAceptado (uint id, address user2);

    event AnunciarPremioCobrado (uint indexReto, address wallet);

    modifier onlyUser1(uint indexReto) {
        require(msg.sender == retos[indexReto].user1.wallet, "No es el Usuario 1");
        _;
    }

    modifier onlyUser2(uint indexReto) {
        require(msg.sender == retos[indexReto].user2.wallet, "No es el Usuario 2");
        _;
    }

    //Solo usuario que esta dentro del reto, OR entre usuarios.
    modifier onlyUser1o2(uint indexReto) {
        require(msg.sender == retos[indexReto].user1.wallet || msg.sender == retos[indexReto].user2.wallet,
        "Debe ser un PLAYER");
        _;
    }

    modifier onlyRetoEmpezado(uint indexReto) {
        require(retos[indexReto].estado == State.Empezado, "El reto no comenzo");
        _;
    }
    
    modifier onlyRetoAbierto(uint indexReto) {
        require(retos[indexReto].estado == State.Abierto, "El reto es inexistente");
        _;
    }

    modifier onlyRetoFinalizado(uint indexReto) {
        require(retos[indexReto].estado == State.Finalizado , "El reto todavia no ha finalizado");
        _;
    }

      // Crear un reto por User1
    function crearReto(uint _id, address _user2) public payable {
        require(msg.sender != _user2, "El Usuer 2 debe ser distinto al creador del reto");
        require(msg.value == montoRetoPorUser, "El monto depositado no es el correcto, se requiere 1 Celo");
        Reto memory nuevoReto = Reto(
            _id,                  // id del reto
            User(msg.sender, CumplioReto.NoSupero, CobroPremio.NoCobrado ,[false, false, false]),  //datos User 1
            User(_user2, CumplioReto.NoSupero, CobroPremio.NoCobrado ,[false, false, false]),// datos User 2
            msg.value,            // Cantidad de Eth
            State.Abierto,        // Estado
            0                    // Fecha de Comienzo
            );
        retos.push(nuevoReto);
        emit RetoCreado(_id, msg.sender, _user2);
    }

    //Anular reto por User1
    function anularReto(uint indexReto) public onlyUser1(indexReto) onlyRetoAbierto(indexReto) {
        //devolver dinero
        payable(msg.sender).transfer(retos[indexReto].montoTotalDepositado);
        retos[indexReto].estado = State.Cerrado;
        retos[indexReto].montoTotalDepositado = 0;
        emit RetoAnulado(retos[indexReto].id);
    }

    //Aceptar reto por User2
    function aceptarReto(uint indexReto) payable public onlyRetoAbierto(indexReto) onlyUser2(indexReto) {
        require(msg.value == montoRetoPorUser, "No es el valor correcto, se requiere 1 ETH");
        retos[indexReto].montoTotalDepositado += msg.value;
        retos[indexReto].estado = State.Empezado;
        retos[indexReto].fechaComienzo = block.timestamp;
        emit RetoAceptado(retos[indexReto].id, msg.sender);
    }

    // De prueba puse un reto cada minuto, durante 3 minutos.
    function completarRetoDiario(uint indexReto) public onlyRetoEmpezado(indexReto) onlyUser1o2(indexReto) {
        uint dia = calcularDia(indexReto);
        require(dia < 3, "Ya termino el tiempo del reto de 3 dias");
        if (msg.sender == retos[indexReto].user1.wallet) {
            require(retos[indexReto].user1.dias[dia] == false, "Ya se cumplio el reto del dia de hoy");
            retos[indexReto].user1.dias[dia] = true;
        } else {
            require(retos[indexReto].user2.dias[dia] == false, "Ya se cumplio el reto del dia de hoy");
            retos[indexReto].user2.dias[dia] = true;
        }     
    }

    function calcularDia(uint indexReto) internal onlyRetoEmpezado(indexReto) view returns(uint) {
        uint diasTranscurridos = (block.timestamp - retos[indexReto].fechaComienzo) / (1 minutes);
        return diasTranscurridos;
    }

    function finalizarReto(uint indexReto) public onlyUser1o2(indexReto) onlyRetoEmpezado(indexReto) {
        require(calcularDia(indexReto) > 2, "Todavia no transcurrio el tiempo total");
        retos[indexReto].estado = State.Finalizado;
        calcularGanador(indexReto);
    }

    function calcularGanador(uint indexReto) internal {
        retos[indexReto].user1.cumplioReto = CumplioReto.SuperoUnico;
        retos[indexReto].user2.cumplioReto = CumplioReto.SuperoUnico;
        for (uint i=0; i < 3; i++) {
            if (!retos[indexReto].user1.dias[i]) {
                retos[indexReto].user1.cumplioReto = CumplioReto.NoSupero;
            }
        }
            for (uint i=0; i < 3; i++) {
                if (!retos[indexReto].user2.dias[i]) {
                    retos[indexReto].user2.cumplioReto = CumplioReto.NoSupero;
            }
        }
        if (retos[indexReto].user1.cumplioReto == CumplioReto.SuperoUnico &&
            retos[indexReto].user2.cumplioReto == CumplioReto.SuperoUnico) {
                retos[indexReto].user1.cumplioReto = CumplioReto.SuperaronAmbos;
                retos[indexReto].user2.cumplioReto = CumplioReto.SuperaronAmbos;
            }
        emit NotificacionDeGanador(
            retos[indexReto].user1.cumplioReto,
            retos[indexReto].user2.cumplioReto
            );
    }

    //Claimear premio
    function reclamarPremio2(uint indexReto) public onlyRetoFinalizado(indexReto) onlyUser1o2(indexReto) {
        if (msg.sender == retos[indexReto].user1.wallet){  // todo lo del user 1
            require (retos[indexReto].user1.cumplioReto != CumplioReto.NoSupero, "El reto no fue superado por este usuario");
            require (retos[indexReto].user1.cobroPremio == CobroPremio.NoCobrado, "Este premio ya fue cobrado por este usuario");
            if (retos[indexReto].user1.cumplioReto == CumplioReto.SuperoUnico) { //si supero User1 solo
                payable(retos[indexReto].user1.wallet).transfer(montoRetoPorUser*2);
                retos[indexReto].montoTotalDepositado -= (montoRetoPorUser*2);
            } else { //Si superaron ambos
                payable(retos[indexReto].user1.wallet).transfer(montoRetoPorUser);
                retos[indexReto].montoTotalDepositado -= (montoRetoPorUser);             
            }
            retos[indexReto].user1.cobroPremio = CobroPremio.Cobrado; // se marca cobrado al User1
            emit AnunciarPremioCobrado(indexReto, msg.sender); // se anuncia premio cobrado por el usuario 1

        } else { // todo lo del user 2
            require (retos[indexReto].user2.cumplioReto != CumplioReto.NoSupero, "El reto no fue superado por este usuario");
            require (retos[indexReto].user2.cobroPremio == CobroPremio.NoCobrado, "Este premio ya fue cobrado por este usuario");
            if (retos[indexReto].user2.cumplioReto == CumplioReto.SuperoUnico) { //si supero User2 solo
                payable(retos[indexReto].user2.wallet).transfer(montoRetoPorUser*2);
                retos[indexReto].montoTotalDepositado -= (montoRetoPorUser*2);
            } else { //Si superaron ambos
                payable(retos[indexReto].user2.wallet).transfer(montoRetoPorUser);
                retos[indexReto].montoTotalDepositado -= (montoRetoPorUser);             
            }
            retos[indexReto].user2.cobroPremio = CobroPremio.Cobrado; // se marca cobrado al User2          
            emit AnunciarPremioCobrado(indexReto, msg.sender); // se anuncia premio cobrado por el usuario 2
        }
    }
}