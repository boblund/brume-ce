export { SpaNavCe };
class SpaNavCe extends HTMLElement {
	constructor() {
		super();
		// Attach a shadow root for style encapsulation
		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.innerHTML = `
			<style>
				nav {
					background-color: #008a8a;
				}

				nav {
					margin: 0;
					padding: 0;
					display: flex;
					height: 50px;
					align-items: center;
					/*justify-content: right; not used with nav :first-child*/
				}

				nav :first-child {
					margin-right: auto; /* 1st li left, all remaining li to the right */
				}

				nav a, nav i {
					display: inline-block;
					padding: 1em 1.5em;
					color: white;
					text-decoration: none;
					transition: background-color 0.3s ease;
				}

				nav a:hover {
					background-color: transparent;
				}

				.fa-bars, .fa-home:hover {
					cursor: pointer;
				}

				/* Dropdown container */
				.dropdown {
					position: relative;
					/*display: inline-block;*/
					margin-left: auto;
					user-select: none;
				}
				/* Dropdown button */
				.dropdown-button {
					padding: 10px 20px;
					background-color: #008a8a;
					color: white;
					cursor: pointer;
					border: none;
					border-radius: 4px;
					font-size: 12px;
				}
				/* Dropdown menu */
				.dropdown-menu {
					position: absolute;
					right: 0;
					top: 100%;
					min-width: 110px;
					background-color: white;
					border: 1px solid #ddd;
					border-radius: 4px;
					box-shadow: 0 8px 16px rgba(0,0,0,0.2);
					display: none;
					z-index: 1000;
				}
				/* Show menu when active */
				.dropdown-menu.show {
					display: block;
				}
				/* Menu items */
				.dropdown-menu a {
					display: block;
					padding: 10px 15px;
					color: #333;
					text-decoration: none;
					cursor: pointer;
				}
				.dropdown-menu a:hover {
					background-color: #f1f1f1;
				}

				.center {
					justify-content: center;
				}

			</style>
			<nav></nav>
		`;
	}

	connectedCallback() {
		setTimeout( () => this.#configure(), 0 );
	}

	#configure(){
		const tagNodes = [];
		const nav = this.shadowRoot.querySelector( 'nav' );

		let underlinedEl;
		let currentEl = document.querySelector( 'div[data-spa="home"]' );
		if( currentEl ) currentEl.classList.add( 'active' ); //.hidden = false;

		for( const n of this.childNodes ){
			if( n?.tagName ){
				tagNodes.push( n );
				n.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					currentEl.classList.remove( 'active' ); //.hidden = true;
					currentEl = document.querySelector( `div[data-spa="${ e.target.id }"]` );
					currentEl.classList.add( 'active' ); //.hidden = false;
					if( underlinedEl ) underlinedEl.style.textDecoration = '';
					if( e.target.id !== 'home' ){
						e.target.style.textDecoration = 'underline';
						underlinedEl = e.target;
					} else {
						underlinedEl = undefined;
					}
				} );
			}
		}

		nav.appendChild( tagNodes.shift() );
		if( tagNodes.length < 4 ){
			for( const n of tagNodes ){ nav.appendChild( n ); };
		} else {
			nav.insertAdjacentHTML( 'beforeend', `
				<div class="dropdown">
					<a href="#" id="ddClick" style="padding: 0.25em; margin-right: 0.75em; font-size: 30px;">&#8801</a>
					<div class="dropdown-menu" ></div>
				</div>
			` );
			const dropDownMenu = nav.querySelector( 'div.dropdown-menu' );
			for( const n of tagNodes ){
				dropDownMenu.appendChild( n );
			};
		}
		const dropdown = nav.querySelector( '.dropdown' );
		if( dropdown ){
			const button = nav.querySelector( '#ddClick' );
			const menu = nav.querySelector( '.dropdown-menu' );

			// Toggle dropdown menu
			button.addEventListener( 'click', ( e ) => {
				e.stopPropagation();
				menu.classList.toggle( 'show' );
			} );

			// Close dropdown when clicking outside
			window.addEventListener( 'click', ( e ) => {
				if ( !dropdown.contains( e.target ) ) {
					menu.classList.remove( 'show' );
				}
			} );
		}
	}
}
