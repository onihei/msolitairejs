import View from './view.js'

export default class RoundRect extends View {

    constructor(props) {
        super(props);
        this.borderRadius = props.borderRadius;
        this.borderWidth = props.borderWidth;
        this.borderColor = props.borderColor;
        this.backgroundColor = props.backgroundColor;
    }
}
