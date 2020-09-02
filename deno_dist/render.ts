import compile from "./compile.ts";
import { getConfig } from "./config.ts";
import { promiseImpl } from "./polyfills.ts";
import EtaErr from "./err.ts";

/* TYPES */

import { EtaConfig, PartialConfig } from "./config.ts";
import { TemplateFunction } from "./compile.ts";
import { CallbackFn } from "./file-handlers.ts";

/* END TYPES */

function handleCache(
  template: string | TemplateFunction,
  options: EtaConfig,
): TemplateFunction {
  var templateFunc;

  if (options.cache && options.name && options.templates.get(options.name)) {
    return options.templates.get(options.name);
  }

  if (typeof template === "function") {
    templateFunc = template;
  } else {
    templateFunc = compile(template, options);
  }

  if (options.cache && options.name) {
    options.templates.define(options.name, templateFunc);
  }

  return templateFunc;
}

export default function render(
  template: string | TemplateFunction,
  data: object,
  env?: PartialConfig,
  cb?: CallbackFn,
) {
  var options = getConfig(env || {});

  if (options.async) {
    var result;
    if (!cb) {
      // No callback, try returning a promise
      if (typeof promiseImpl === "function") {
        return new promiseImpl(function (resolve: Function, reject: Function) {
          try {
            result = handleCache(template, options)(data, options);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      } else {
        throw EtaErr(
          "Please provide a callback function, this env doesn't support Promises",
        );
      }
    } else {
      try {
        handleCache(template, options)(data, options, cb);
      } catch (err) {
        return cb(err);
      }
    }
  } else {
    return handleCache(template, options)(data, options);
  }
}
