import View from './view.js'

export default class Label extends View {

    constructor(props) {
        super(props);
        this.text = props.text;
        this.fontFamily = props.fontFamily;
        this.fontSize = props.fontSize || 20;
        this.textBaseline = props.textBaseline;
        this.textAlign = props.textAlign;
        this.color = props.color;
    }
}
