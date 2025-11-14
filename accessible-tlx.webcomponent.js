import 'element-internals-polyfill/dist';
import 'regenerator-runtime/runtime';
import {css, html, LitElement} from 'lit-element';
import {customElement, property} from 'lit/decorators.js';
import {AltTypes, PresenceContents, TlxContents, TlxExtremes} from './accessible-tlx.contents';
import i18n from './i18n/i18n';

@customElement('accessible-tlx')
export class AccessibleTlx extends LitElement {
    static DEFAULT_LOCALE = 'en_US';
    static formAssociated = true;

    @property({type: String}) name;
    @property({type: Object, reflect: true}) value = {};
    @property({type: Boolean, attribute: 'multi-field'}) multiField = false;
    @property({type: Boolean, attribute: 'hide-header'}) hideHeader = false;
    @property({type: String, attribute: 'alt-type'}) altType = null;
    @property({type: String}) locale = AccessibleTlx.DEFAULT_LOCALE;

    _internals;

    constructor() {
        super();
        // Language valid?
        if (!i18n[this.locale]) {
            console.error(`could not find locale '${this.locale}'. Valid locales are: `, Object.keys(i18n));
            this.locale = AccessibleTlx.DEFAULT_LOCALE;
        }
        if (this.attachInternals !== undefined) {
            this._internals = this.attachInternals();
        }
        this.checkValidity();
    }

    static get styles() {
        return css`
          :host {
            --face-size: var(--tlx-face-size, 60px);
            --border-normal: var(--tlx-border-normal, #000000);
            --border-highlight: var(--tlx-border-highlight, #0000ff);
            --error-highlight: var(--tlx-error-highlight, none);
            --shade-color: var(--tlx-shade-color, #eeeeee);
            font-family: Roboto, "Helvetica Neue", sans-serif;
          }

          :host(:invalid) .container {
            background-color: var(--error-highlight);
          }

          .container {
          }

          .row {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: auto;
            padding: 1em;
          }
          .row:nth-child(2n) {
            background-color: var(--shade-color);
          }

          span.item {
            font-size: calc(var(--face-size) / 2.5);
          }

          .item-name {
            text-align: left;
            grid-column: 1 / span 7;
          }

          .item-description {
            text-align: center;
            grid-column: 1 / span 7;
          }
            
          .item-label {
              text-align: center;
          }
            
          .face {
            width: var(--face-size);
            height: var(--face-size);
            border: 3px solid var(--border-normal);
            border-radius: var(--face-size);
            cursor: pointer;
            margin: calc(var(--face-size) / 10) auto;
          }

          .face.selected {
            box-shadow: 0 0 20px var(--border-highlight),
            0 0 20px var(--border-highlight),
            0 0 20px var(--border-highlight),
            0 0 20px var(--border-highlight);
            border-color: var(--border-highlight);
          }

          .face.selected .decals circle {
            fill: var(--border-highlight);
          }

          .face.selected .line {
            stroke: var(--border-highlight);
          }

          .face .decals {
            width: 70%;
            margin-top: 10%;
            padding: 0 15%;
          }

          .face input {
            display: none;
          }
        `;
    }

    render() {
        let Contents;
        switch (this.altType?.toLowerCase()) {
            case AltTypes.Presence:
                Contents = PresenceContents;
                break;
            default:
                Contents = TlxContents;
                break;
        }
        return html`<div class="container">${Object.entries(Contents).map(([row, reverse]) => this._renderRow(row, reverse))}</div>`;
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }
    get form() { return this._internals.form; }
    get validity() {return this._internals.validity; }
    get validationMessage() {return this._internals.validationMessage; }
    get willValidate() {return this._internals.willValidate; }
    reportValidity() {return this._internals.reportValidity(); }

    checkValidity() {
        const allFieldsFilled = [...this.shadowRoot.querySelectorAll('div.face')].filter(x => [...x.classList].includes('selected')).length === 8;
        if (allFieldsFilled) {
            this._internals.setValidity({});
        } else {
            this._internals.setValidity({valueMissing: true}, this._t('error.fields missing'));
        }
        return allFieldsFilled;
    }

    /**
     * Safari polyfill
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute#polyfill
     */
    toggleAttribute(name, force) {
        if(force !== void 0) force = !!force
        if (this.hasAttribute(name)) {
            if (force) return true;
            this.removeAttribute(name);
            return false;
        }
        if (force === false) return false;
        this.setAttribute(name, "");
        return true;
    }

    _t(key) {
        try {
            return key.split('.').reduce((agg, cur) => agg[cur], i18n[this.locale].translations);
        } catch (e) {
            return `%${key}%`;
        }
    }

    _faceIsSelected(rowName, faceIndex) {
        return this.value.hasOwnProperty(rowName) &&
            faceIndex === this.value[rowName];
    }

    _renderFace(rowName, faceIndex, reverse) {
        const percent = ((reverse ? 7 - faceIndex : faceIndex - 1)) / 6;
        const hue = Math.floor(percent * 120);
        const mouthSouth = 90 + ((.5 - percent) * 10);
        const mouthRound = 90 + ((percent - .5) * 80);
        const faceColor = `hsl(${hue},100%,50%)`;
        const mouthPath = `M 5 ${mouthSouth} Q 55 ${mouthRound} 105 ${mouthSouth}`;
        const isSelected = this._faceIsSelected(rowName, faceIndex);
        return html`
        <div class="face${isSelected ? ' selected' : ''}" style="background-color: ${faceColor}"
             @click="${this._faceClickCallback}"
             data-name="${rowName}"
             data-value="${faceIndex}">
          <svg class="decals" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
            <circle r="10" cx="25" cy="40" fill="black"></circle>
            <circle r="10" cx="85" cy="40" fill="black"></circle>
            <path class="line" d="${mouthPath}" stroke="black" fill="transparent" stroke-width="5"></path>
          </svg>
        </div>`;
    }

    _renderRow(rowName, reverse) {
        const x = [];
        if (!this.hideHeader) x.push(html`<span class="item item-name">${this._t(rowName + '.title')}</span>`);
        x.push(html`<span class="item item-description">${this._t(rowName + '.description')}</span>`);
        for (let i = 1; i <= 7; i++) {
            x.push(this._renderFace(rowName, i, reverse));
        }
        x.push(html`<span class="item item-label">${this._t(TlxExtremes[reverse].l)}</span>`);
        for (let i = 1; i <= 5; i++) x.push(html`<span class="item"></span>`);
        x.push(html`<span class="item item-label">${this._t(TlxExtremes[reverse].r)}</span>`);
        return html`<div class="row">${x}</div>`;
    }

    _faceClickCallback($evt) {
        let target = $evt.target;
        if (! target.matches('div.face')) {
            target = target.closest('div.face');
        }

        // unselect whole row
        target.parentNode.querySelectorAll('div.face').forEach(x => x.classList.remove('selected'));
        target.classList.add('selected');
        this.value[target.dataset.name] = target.dataset.value;
        this.checkValidity();
        this.dispatchEvent(new Event('change'));
        this._applyMultiValues();
        this.requestUpdate();
    }

    _applyMultiValues() {
        const data = new FormData();
        Object.entries(this.value).forEach(([i, cur]) => data.append(`${this.name}[${i}]`, cur));
        this._internals.setFormValue(data);
    }
}
