const InteractionBase = require('../../Structures/CommandBase');
const ms = require('ms');

/** info(func): FUNCTIONS */
function random(array, _items) {
	const arr = [...array];
	const randomPicks = [];

	for (let index = 0; index < _items; index++) {
		const ri = Math.floor(Math.random() * arr.length);

		randomPicks.push(arr[ri]);
		arr.splice(ri, 1);
	}

	return randomPicks;
}

function shuffle(array) {
	const arr = [...array];

	for (let index = arr.length - 1; index > 0; index--) {
		const ri = Math.floor(Math.random() * (index + 1));
		const original = arr[index];

		arr[index] = arr[ri];
		arr[ri] = original;
	}

	return arr;
}

module.exports = class PingInteraction extends InteractionBase {
	constructor(...args) {
		super(...args, {
			name: 'pairs',
			description: 'Math the pairs!',
			options: [
				{
					type: 3, name: 'difficulty', description: 'The difficulty of the game.',
					choices: [
						{ value: 'sandbox', name: 'Sandbox' },
						{ value: 'beginner', name: 'Beginner' },
						{ value: 'averager', name: 'Average' },
						{ value: 'tireless', name: 'Tireless' },
						{ value: 'chad', name: 'Chad' },
					], required: true,
				},
			],
			cooldown: 60000,
		});
	}
	/**
   * @param {Interaction} interaction
   * @param {Client} client
   */
	async run(interaction) {
		await interaction.acknowledge(64).catch(() => { });

		if(this.client.data.includes(interaction.member.id)) return interaction.createFollowup('dude you already have a game running, wait for it to finish :skull:');
		const { value } = this.client.utils.getOptions('difficulty', interaction);


		/** info(var): FOR STORING DATA */
		let B = 0;
		let time;
		let timeout = false;
		let selectedCard = { card: null, loc: { x: null, y: null } };

		const ids = [];
		const rows = 4;
		const componentsArray = [];
		const possibleTable = ['<:copege:968093020291485726>', '<:disagreege:972945746003390514>', '<:agreege:968137766615527514>', '<:oldge:968137766573600838>', '<:painge:968137766737182740>', '<:gladge:968094726127493200>', '<:sussmirkge:968137766640685116>', '<:madge:811587946708729877>', '<:radge:968137766816858163>', '<:seriousHmmge:968137766946873384>', '<:sadge:811587838382047273>', '<:nerdge:968090210900525106>'];
		const tries = { max: undefined, now: 0, correct: 0 };
		const picks = random(possibleTable, (rows * rows) / 2);
		const items = shuffle([...picks, ...picks]);
		const title = '😳\\_\\_\\_**\\_---__^^^__** Matching Pairs **__^^^__---\\_**\\_\\_\\_😳\n';

		/** info(if): MANAGING DIFFICULTIES */
		if(value == 'sandbox') { time = 950000, tries.max = 9999; }
		if(value == 'beginner') { time = 60000, tries.max = 30; }
		if(value == 'average') { time = 45000, tries.max = 20; }
		if(value == 'tireless') { time = 30000, tries.max = 15; }
		if(value == 'chad') { time = 20000, tries.max = 10; }

		/** info(for): LOOPS SECTION */
		for(let i = 0; i < 4; i++) {
			componentsArray.push({
				type: 1,
				components: [],
			});
		}

		for(let i = 0; i < items.length; i++) {
			ids.push(String(Math.random()));
			insert(i, true, '<:unknownpepege:977450118427070515>');
		}

		function insert(L, v, em) {
			if(v) B = parseInt(L / 4);

			componentsArray[B].components.push({ type: 2, style: 2, custom_id: ids[L], label: '\u200b', emoji: { id: em.split(':')[2].replace(/>/gi, '') } });
		}

		function lockButtons() {
			for(let C = 0; C < 4; C++) {
				for(let J = 0; J < componentsArray[C].components.length; J++) {
					console.log(C, J);
					componentsArray[C].components[J].disabled = true;
				}
			}
		}

		function die(message) {
			collector.stopListening('end');

			this.client.data.splice(this.client.data.indexOf(interaction.member.id), 1);
			lockButtons();
			interaction.editOriginalMessage({
				components: componentsArray,
				content: title + message,
			});
		}
		function check() {
			if(tries.now >= tries.max) {
				return die('You ran out of tries bruv');
			}
		}

		/** info(followUp): COLLECTOR */
		await interaction.createFollowup({
			components: componentsArray,
			content: title + `\`Time\`: ${ms(time)} | \`Tries\`: ${tries.now}/${tries.max}`,
		});


		const collector = await this.client.utils.createInteractionCollector({
			client: this.client,
			componentType: 2,
			/** info(value): FOR NOT AUTO-DEFERRING THE INTERACTION */
			restify: true,
			filter: ((_e) => _e),
		});

		this.client.data.push(interaction.member.id);
		setTimeout(async () => {
			die('Time ended, L + ratio + bozo');
		}, time);

		collector.on('collect', async (button) => {
			if (!ids.includes(button.data.custom_id)) return;
			if(timeout) {
				await button.defer(64);
				return button.createFollowup('Howdy here cowboy! Slow it down!');
			}
			const indexof = ids.indexOf(button.data.custom_id);
			const card = items[indexof];

			await button.deferUpdate().catch(() => {});

			componentsArray[parseInt(indexof / 4)].components[indexof % 4].emoji.id = card.split(':')[2].replace(/>/gi, '');

			if(selectedCard.card == card) {
				tries.correct++;
				await check();
				componentsArray[parseInt(indexof / 4)].components[indexof % 4].disabled = true;
				componentsArray[selectedCard.loc.x].components[selectedCard.loc.y].disabled = true;

				selectedCard = { card: null, loc: { x: null, y: null } };

				interaction.editOriginalMessage({
					components: componentsArray,
					content: title + `\`Time\`: ${ms(time)} | \`Tries\`: ${tries.now}/${tries.max}`,
				});

				return;
			}

			if(!selectedCard.card) selectedCard = { card: card, loc: { x: parseInt(indexof / 4), y: indexof % 4 } };

			interaction.editOriginalMessage({
				components: componentsArray,
				content: title + `\`Time\`: ${ms(time)} | \`Tries\`: ${tries.now}/${tries.max}`,
			});

			if(selectedCard.card !== card) {
				timeout = true;
				setTimeout(async () => {
					tries.now++;
					await check();
					componentsArray[parseInt(indexof / 4)].components[indexof % 4].emoji.id = '977450118427070515';
					componentsArray[selectedCard.loc.x].components[selectedCard.loc.y].emoji.id = '977450118427070515';
					selectedCard = { card: null, loc: { x: null, y: null } };

					interaction.editOriginalMessage({
						components: componentsArray,
						content: title + `\`Time\`: ${ms(time)} | \`Tries\`: ${tries.now}/${tries.max}`,
					});

					timeout = false;
				}, 1500);
			}
		});
	}
};