﻿import { CSharpProperty } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';

export interface PropertyEmitOptions {
	filter?: (property: CSharpProperty) => boolean;

	typeEmitOptions?: TypeEmitOptions
}

export class PropertyEmitter {
	private typeEmitter: TypeEmitter;

	constructor(private stringEmitter: StringEmitter) {
		this.typeEmitter = new TypeEmitter(stringEmitter);
    }

	emitProperties(properties: CSharpProperty[], options?: PropertyEmitOptions) {
		options = this.prepareOptions(options);

        for (var property of properties) {
            this.emitProperty(property, options);
        }
    }

	emitProperty(property: CSharpProperty, options?: PropertyEmitOptions) {
		options = this.prepareOptions(options);

		if (!options.filter(property))
			return;

		this.stringEmitter.writeIndentation();
		this.stringEmitter.write(property.name + ": ");
		this.typeEmitter.emitType(property.type, options.typeEmitOptions);
		this.stringEmitter.write(";");
		this.stringEmitter.writeLine();
	}

	private prepareOptions(options?: PropertyEmitOptions) {
		if (!options) {
			options = {};
		}

		if (!options.filter) {
			options.filter = () => true;
		}

		return options;
	}

}