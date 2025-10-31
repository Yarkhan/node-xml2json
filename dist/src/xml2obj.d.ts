interface toJsonOptions {
    reversible?: boolean;
    trim?: boolean;
    textNode?: string;
}
declare const toJson: (xml?: string, _options?: toJsonOptions) => any;
export default toJson;
