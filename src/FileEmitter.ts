﻿import { FileParser, CSharpEnum, CSharpEnumOption } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';
import { NamespaceEmitter, NamespaceEmitOptions } from './NamespaceEmitter';
 
export interface FileEmitOptions {
	classEmitOptions?: ClassEmitOptions,
	namespaceEmitOptions?: NamespaceEmitOptions,
	enumEmitOptions?: EnumEmitOptions
}

export class FileEmitter {
	public readonly stringEmitter: StringEmitter;

    private fileParser: FileParser;
    private enumEmitter: EnumEmitter;
    private classEmitter: ClassEmitter;
    private namespaceEmitter: NamespaceEmitter;

    constructor(content: string) {
        this.fileParser = new FileParser(content);
        this.stringEmitter = new StringEmitter();

        this.enumEmitter = new EnumEmitter(this.stringEmitter);
        this.classEmitter = new ClassEmitter(this.stringEmitter);
		this.namespaceEmitter = new NamespaceEmitter(this.stringEmitter);
    }

	emitFile(options?: FileEmitOptions) {
		if (!options) {
			options = {};
		}

		if (options.classEmitOptions && options.namespaceEmitOptions) {
			options.namespaceEmitOptions.classEmitOptions = options.classEmitOptions;
		}

		if (options.enumEmitOptions) {
			if (options.classEmitOptions) {
				options.classEmitOptions.enumEmitOptions = options.enumEmitOptions;
			}
			if (options.namespaceEmitOptions) {
				options.namespaceEmitOptions.enumEmitOptions = options.enumEmitOptions;
			}
		}

		var file = this.fileParser.parseFile();

		if (file.enums.length > 0) {
			this.enumEmitter.emitEnums(file.enums, options.enumEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (file.namespaces.length > 0) {
			this.namespaceEmitter.emitNamespaces(file.namespaces, options.namespaceEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (file.classes.length > 0) {
			this.classEmitter.emitClasses(file.classes, options.classEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		this.stringEmitter.removeLastNewLines();

        return this.stringEmitter.output;
    }
}