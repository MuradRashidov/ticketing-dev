import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    const ticket = await Ticket.build({
        title:'asd',
        price:1,
        userId:'sdssf'
    });
    await ticket.save();
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    firstInstance?.set('title',"dddg");
    secondInstance?.set('price',30);

    await firstInstance?.save();
    try {
        await secondInstance!.save();
      } catch (err) {
        return;
      }
});

it('increament version number each save', async () => {
    const ticket = await Ticket.build({
        title:'asd',
        price:1,
        userId:'sdssf'
    });
    
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});