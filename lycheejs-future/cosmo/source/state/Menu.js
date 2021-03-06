
lychee.define('game.state.Menu').requires([
	'lychee.ui.Button',
	'lychee.ui.Label',
	'game.entity.Background',
	'game.entity.menu.Button',
	'game.entity.menu.Keypad',
	'game.entity.menu.Layer',
	'game.entity.menu.TileLayer'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _blob  = attachments["json"].buffer;
	var _font  = attachments["fnt"];
	var _music = attachments["msc"];



	/*
	 * HELPERS
	 */

	var _refresh_arrows = function(root) {

		if (root.tile.y === 0) {

			this.queryLayer('ui', 'arrow-top').setVisible(false);

			if (root.tile.x > 0) {
				this.queryLayer('ui', 'arrow-left').setVisible(true);
			} else {
				this.queryLayer('ui', 'arrow-left').setVisible(false);
			}

			if (root.tile.x < root.bound.x) {
				this.queryLayer('ui', 'arrow-right').setVisible(true);
			} else {
				this.queryLayer('ui', 'arrow-right').setVisible(false);
			}

		} else if (root.tile.y > 0) {

			this.queryLayer('ui', 'arrow-top').setVisible(true);
			this.queryLayer('ui', 'arrow-right').setVisible(false);
			this.queryLayer('ui', 'arrow-left').setVisible(false);

		}


		if (root.tile.y < root.bound.y) {
			this.queryLayer('ui', 'arrow-bottom').setVisible(true);
		} else {
			this.queryLayer('ui', 'arrow-bottom').setVisible(false);
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(game) {

		lychee.game.State.call(this, game);


		this.__background = null;


		this.deserialize(_blob);
		this.reshape();

	};


	Class.prototype = {

		deserialize: function(blob) {

			lychee.game.State.prototype.deserialize.call(this, blob);


			var entity  = null;
			var service = null;


			entity = this.queryLayer('ui', 'arrow-top');
			entity.bind('touch', function() {

				var root = this.queryLayer('tiles', 'root');

				root.setTile({ y: root.tile.y - 1 });
				_refresh_arrows.call(this, root);

			}, this);

			entity = this.queryLayer('ui', 'arrow-right');
			entity.bind('touch', function() {

				var root = this.queryLayer('tiles', 'root');

				if (root.tile.y === 0) {
					root.setTile({ x: root.tile.x + 1 });
					_refresh_arrows.call(this, root);
				}

			}, this);

			entity = this.queryLayer('ui', 'arrow-bottom');
			entity.bind('touch', function() {

				var root = this.queryLayer('tiles', 'root');

				root.setTile({ y: root.tile.y + 1 });
				_refresh_arrows.call(this, root);

			}, this);

			entity = this.queryLayer('ui', 'arrow-left');
			entity.bind('touch', function() {

				var root = this.queryLayer('tiles', 'root');

				if (root.tile.y === 0) {
					root.setTile({ x: root.tile.x - 1 });
					_refresh_arrows.call(this, root);
				}

			}, this);


			entity = this.queryLayer('tiles', 'root > singleplayer-details');
			entity.bind('touch', function() {

				console.log('FUCK');

				this.main.changeState('game', {
					type: 'singleplayer',
					touchcontrols: this.main.settings.touchcontrols
				});

			}, this);

			entity = this.queryLayer('tiles', 'root > multiplayer > background');
			entity.setState('multiplayer-disabled');

			service = this.main.client.services.multiplayer;
			service.bind('plug', function() {
				this.queryLayer('tiles', 'root > multiplayer > background').setState('multiplayer');
			}, this);

			service = this.main.client.services.multiplayer;
			service.bind('unplug', function() {
				this.queryLayer('tiles', 'root > multiplayer > background').setState('multiplayer-disabled');
			}, this);

			entity = this.queryLayer('tiles', 'root > multiplayer-details > keypad');
			entity.bind('code', function(code) {

				console.log(code);
/*
				this.main.changeState('game', {
					type: 'singleplayer',
					touchcontrols: this.main.settings.touchcontrols
				});
*/
			}, this);



			entity = this.queryLayer('tiles', 'root > settings-details > fullscreen');
			entity.setLabel('Fullscreen:' + ((this.main.viewport.fullscreen === true) ? ' On': 'Off'));
			entity.bind('#touch', function(entity) {

				var viewport   = this.main.viewport;
				var fullscreen = !viewport.fullscreen;

				entity.setLabel('Fullscreen:' + ((fullscreen === true) ? ' On': 'Off'));
				viewport.setFullscreen(fullscreen);

			}, this);

			entity = this.queryLayer('tiles', 'root > settings-details > touch');
			entity.setLabel('Touch:     ' + ((this.main.settings.touchcontrols === true) ? ' On': 'Off'));
			entity.bind('#touch', function(entity) {

				var touch = !this.main.settings.touchcontrols;

				entity.setLabel('Touch:     ' + ((touch === true) ? ' On': 'Off'));
				this.main.settings.touchcontrols = touch;

			}, this);

			entity = this.queryLayer('tiles', 'root > settings-details > music');
			entity.setLabel('Music:     ' + ((this.main.jukebox.music === true) ? ' On': 'Off'));
			entity.bind('#touch', function(entity) {

				var jukebox = this.main.jukebox;
				var music   = !jukebox.music;

				entity.setLabel('Music:     ' + ((music === true) ? ' On': 'Off'));
				jukebox.setMusic(music);

			}, this);

			entity = this.queryLayer('tiles', 'root > settings-details > sound');
			entity.setLabel('Sound:     ' + ((this.main.jukebox.sound === true) ? ' On': 'Off'));
			entity.bind('#touch', function(entity) {

				var jukebox = this.main.jukebox;
				var sound   = !jukebox.sound;

				entity.setLabel('Sound:     ' + ((sound === true) ? ' On': 'Off'));
				jukebox.setSound(sound);

			}, this);

			entity = this.queryLayer('tiles', 'root > settings-details > debug');
			entity.setLabel('Debug:     ' + ((lychee.debug === true) ? ' On': 'Off'));
			entity.bind('#touch', function(entity) {

				var debug = !lychee.debug;

				entity.setLabel('Debug:     ' + ((debug === true) ? ' On': 'Off'));
				lychee.debug = debug;

			}, this);

			entity = this.queryLayer('tiles', 'root > highscores > background');
			entity.setState('highscores-disabled');

			service = this.main.client.services.highscores;
			service.bind('plug', function() {
				this.queryLayer('tiles', 'root > highscores > background').setState('highscores');
			}, this);

			service = this.main.client.services.highscores;
			service.bind('unplug', function() {
				this.queryLayer('tiles', 'root > highscores > background').setState('highscores-disabled');
			}, this);

		},

		reshape: function(orientation, rotation) {

			lychee.game.State.prototype.reshape.call(this, orientation, rotation);


			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var width  = renderer.width;
				var height = renderer.height;


				entity = this.queryLayer('background', 'background');
				entity.width  = renderer.width;
				entity.height = renderer.height;
				this.__background = entity;


				entity = this.queryLayer('tiles', 'root');
				entity.setTileWidth(renderer.width);
				entity.setTileHeight(renderer.height);

			}

		},

		enter: function(data) {

			lychee.game.State.prototype.enter.call(this);


			this.main.jukebox.play(_music);


			var root = this.queryLayer('tiles', 'root');
			if (root !== null) {
				root.setTile({ x: 0 });
				_refresh_arrows.call(this, root);
			}

		},

		leave: function() {

			this.main.jukebox.stop(_music);

		},

		update: function(clock, delta) {

			lychee.game.State.prototype.update.call(this, clock, delta);


			var background = this.__background;
			if (background !== null) {

				var origin = background.origin;

				background.setOrigin({
					y: origin.y + 10 * (delta / 1000)
				});

			}

		}

	};


	return Class;

});
