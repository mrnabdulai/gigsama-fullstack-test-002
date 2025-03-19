import lodash from "lodash";
import { model, FilterQuery, Schema, isObjectIdOrHexString, PipelineStage, PopulateOptions } from "mongoose";

type PaginationParams = {
  page?: string | number;
  pageSize?: string | number;
};

type SortParams = {
  sort?: string;
};

type PopulateParams = {
  populate?: string | string[];
};
export interface IDataMap<T = any> {
  [key: string]: T;
}
/**
 * Generate pagination parameters for MongoDB queries
 */
export function generatePagination(params: PaginationParams): { skip: number; limit: number } {
  const page = Number(params.page || 1);
  const pageSize = Number(params.pageSize || 100);
  
  const validatedPage = Math.max(1, page);
  const validatedPageSize = Math.max(0, pageSize); // 0 means no limit
  
  return { 
    skip: (validatedPage - 1) * validatedPageSize, 
    limit: validatedPageSize 
  };
}

/**
 * Generate sort parameters for MongoDB queries
 */
export function generateSort(params: SortParams): Record<string, 1 | -1> {
  if (!params.sort) return {};
  
  return lodash.fromPairs<1 | -1>(
    params.sort.split(" ")
      .filter(Boolean)
      .map((field) => [
        field.replace("-", ""),
        field.startsWith("-") ? -1 : 1,
      ])
  );
}

/**
 * Build projection object from select string
 */
export function generateProjection(select?: string): Record<string, 0 | 1> {
  if (!select) return {};
  
  return lodash.fromPairs<0 | 1>(
    select.split(" ")
      .filter(Boolean)
      .map((field) => [
        field.replace("-", ""),
        field.startsWith("-") ? 0 : 1,
      ])
  );
}

/**
 * Finds documents in a model with filtering, pagination, sorting, and population
 */
export async function runFind<T = any>(
  modelName: string,
  params: {
    query?: FilterQuery<T>;
    page?: string | number;
    pageSize?: string | number;
    populate?: string | string[];
    sort?: string;
  } = {},
  select?: string
) {
  const { query = {}, populate = [] } = params;
  const { skip, limit } = generatePagination(params);
  const sortOptions = generateSort(params);
  const projection = generateProjection(select);
  
  const findQuery = model(modelName).find(query);
  
  // Apply projection if needed
  if (Object.keys(projection).length > 0) {
    findQuery.select(projection);
  }
  
  // Apply sorting if needed
  if (Object.keys(sortOptions).length > 0) {
    findQuery.sort(sortOptions);
  }
  
  // Apply pagination
  findQuery.skip(skip);
  if (limit > 0) {
    findQuery.limit(limit);
  }
  
  // Handle population
  if (populate) {
    const populateOptions = getPopulateOptions(modelName, 
      typeof populate === 'string' ? populate.split(",") : populate
    );
    if (populateOptions.length > 0) {
      findQuery.populate(populateOptions);
    }
  }
  
  return findQuery.lean().exec();
}

/**
 * Counts documents in a model with filtering
 */
export async function runCount<T = any>(
  modelName: string,
  params: {
    query?: FilterQuery<T>;
  } = {}
): Promise<number> {
  const { query = {} } = params;
  return model(modelName).countDocuments(query).exec();
}

/**
 * Finds a single document in a model with filtering and population
 */
export async function runFindOne<T = any>(
  modelName: string,
  params: {
    query?: FilterQuery<T>;
    populate?: string | string[];
  } = {},
  select?: string
) {
  const { query = {}, populate = [] } = params;
  const projection = generateProjection(select);
  
  const findQuery = model(modelName).findOne(query);
  
  // Apply projection if needed
  if (Object.keys(projection).length > 0) {
    findQuery.select(projection);
  }
  
  // Handle population
  if (populate) {
    const populateOptions = getPopulateOptions(modelName, 
      typeof populate === 'string' ? populate.split(",") : populate
    );
    if (populateOptions.length > 0) {
      findQuery.populate(populateOptions);
    }
  }
  
  return findQuery.lean().exec();
}

/**
 * Finds a document by ID
 */
export async function runGetId(modelName: string, id: string) {
  if (!id) return null;
  return model(modelName).findById(id).lean().exec();
}

/**
 * Maps mongoose schema paths to populate options
 */
export function getPopulateMap(
  schema: Schema,
  result: Array<{ path: string; ref: string }> = [],
  parent: string = ""
) {
  schema.eachPath(function (path, schemaType) {
    const fullPath = parent ? [parent, path].join(".") : path;
    
    if (schemaType.instance === "Embedded") {
      getPopulateMap(schemaType.schema, result, fullPath);
    } 
    else if (schemaType.instance === "Array") {
      if (schemaType.schema) {
        getPopulateMap(schemaType.schema, result, fullPath);
      } 
      else if ((schemaType as any)?.["$embeddedSchemaType"]?.instance === "ObjectID") {
        result.push({ path: fullPath, ref: schemaType?.options?.ref });
      }
    } 
    else if (schemaType.instance === "ObjectID" && path !== "_id") {
      result.push({ path: fullPath, ref: schemaType?.options?.ref });
    }
  });
  
  return result;
}

/**
 * Builds populate options for mongoose queries
 */
export function getPopulateOptions(modelName: string, paths: string[] = []): PopulateOptions[] {
  if (!paths.length) return [];
  
  const populateMap = getPopulateMap(model(modelName).schema);
  const populateOptions: PopulateOptions[] = [];
  
  // Group paths by their base populate path
  const pathGroups = lodash.groupBy(paths, (path) => {
    const populateMapItem = populateMap.find((item) => {
      return (
        path === item.path ||
        path.match(new RegExp(`^${item.path}\\.(.)+$`, "g"))
      );
    });
    return populateMapItem?.path || "ignore";
  });
  
  // Process each group
  lodash.forEach(pathGroups, (items, populateMapPath) => {
    if (populateMapPath === "ignore") return;
    
    const { path, ref } = populateMap.find(
      (item) => populateMapPath === item.path
    ) || { path: "", ref: "" };
    
    if (!path || !ref) return;
    
    if (items.length === 1 && items[0] === path) {
      // Simple populate
      populateOptions.push({ path });
    } else {
      // Nested populate
      populateOptions.push({
        path,
        populate: getPopulateOptions(
          ref,
          items
            .filter((item) => item !== path)
            .map((item) => item.replace(path + ".", ""))
        ),
      });
    }
  });
  
  return populateOptions;
}