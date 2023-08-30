import { Socket } from 'socket.io';
import { Game, GameState, Player } from '../models';
import { Games } from '.';
import { Utils } from '../../utils';

/**
 * RocketRide
 * 
 * The concrete implementation of the RocketRide
 * game type.
 *
 */
export default class RocketRide extends Game {

    crashed: number;

    constructor(id: number) {
        super(id, Games.RocketRide, 1, 16);
        this.crashed = 0;

        this.listeners.set("opt", (socket: Socket, player: Player, amount: number) => {
            if (amount == 0) this.optOut(socket, player);
            else this.optIn(socket, player, amount);
        });

        this.listeners.set("pull", (socket: Socket, player: Player) => this.pullOut(socket, player));
    }

    start() {
        this.time = 0;
        this.crashed = 0;
    }

    update() {
        this.time++;
        if (Math.random() <= 0.02) {
            this.crashed = this.time;
            this.time = -1;
            this.state = GameState.Ended;
        }
        this.broadcastTick({ multiplier: this.time });
    }

    end() {
        this.log(`The multiplier crashed at: ${this.crashed / 10}x`);
    }

    async optIn(socket: Socket, player: Player, amount: number) {
        if (this.state != GameState.Lobby) return;
        
        if (amount <= 0) {
            this.error(socket, "Who do you think you are? Betting a negative amount!");
            return;
        }
 
        if (player.total < amount) {
            this.error(socket, `You cannot make this bet! (${player.total} < ${amount})`);
            return;
        }

        player.bet = amount;
        socket.emit("opt", { confirmed: true, amount: Utils.format(amount) });
        this.log(`${player.username} opted-in for ${amount}.`);
        this.broadcastStatus();
    }

    optOut(socket: Socket, player: Player) {
        if (this.state != GameState.Lobby) return;

        player.bet = 0;
        socket.emit("opt", { confirmed: false });
        this.log(`${player.username} opted-out.`);
        this.broadcastStatus();
    }

    pullOut(socket: Socket, player: Player) {
        if (this.state != GameState.Started || !player.bet || this.winners.find(winner => winner.id == player.id)) return;

        let pulloutMultiplier = this.time / 10;
        this.winners.push({
            id: player.id,
            username: player.username,
            value: pulloutMultiplier * player.bet
        });

        socket.emit("pull", pulloutMultiplier);
        this.log(`${player.username} pulled out at ${pulloutMultiplier}x.`);
        this.broadcastStatus();
    }

    getStatus(player: Player) {
        return this.state == GameState.Started ? { data: (this.winners.find(value => value.id === player.id) ? "PULLED OUT" : "STILL IN") } : super.getStatus(player);
    }

}