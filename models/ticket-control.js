const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor() {
    this.ultimo = 0; //se va a ir incrementando
    this.hoy = new Date().getDate(); // 11
    this.tickets = [];
    this.ultimos4 = []; //los que vamos a estar mostrando

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  init() {
    const { hoy, tickets, ultimos4, ultimo } = require("../db/data.json");
    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      //es otro dia
      this.guardarDB();
    }
  }

  guardarDB() {
    const dbPath = path.join(__dirname, "../db/data.json");
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  siguiente() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);

    this.guardarDB();
    return "Ticket " + ticket.numero;
  }

  atenderTicket(escritorio) {
    //no tenemos tickets
    if (this.tickets.length === 0) {
      return null;
    }
    //Quitamos el 1er ticket
    // const ticket = this.tickets[0];
    const ticket = this.tickets.shift();
    ticket.escritorio = escritorio;
    //añadimos el ticket al arreglo
    this.ultimos4.unshift(ticket);
    //validamos que sean 4
    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1); //similar a python
    }
    this.guardarDB();
    return ticket;
  }
}

module.exports = TicketControl;
