import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { CreateTagNameDto } from "..\\requests\\models\\CreateTagNameDto";
import { CreateTagDto } from "..\\requests\\models\\CreateTagDto";
import { DefaultService } from "..\\requests\\services\\DefaultService";
export const useDefaultServiceAppControllerStatusKey = "DefaultServiceAppControllerStatus";
export const useDefaultServiceAppControllerStatus = <TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof DefaultService.appControllerStatus>>, unknown, Awaited<ReturnType<typeof DefaultService.appControllerStatus>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery([useDefaultServiceAppControllerStatusKey, ...(queryKey ?? [])], () => DefaultService.appControllerStatus(), options);
export const useDefaultServiceActivitiesControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof DefaultService.activitiesControllerCreate>>, unknown, void, unknown>, "mutationFn">) => useMutation(() => DefaultService.activitiesControllerCreate(), options);
export const useDefaultServiceActivitiesControllerFindAllKey = "DefaultServiceActivitiesControllerFindAll";
export const useDefaultServiceActivitiesControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ startedAt, endedAt }: {
    startedAt: string;
    endedAt: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof DefaultService.activitiesControllerFindAll>>, unknown, Awaited<ReturnType<typeof DefaultService.activitiesControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery([useDefaultServiceActivitiesControllerFindAllKey, ...(queryKey ?? [{ startedAt, endedAt }])], () => DefaultService.activitiesControllerFindAll(startedAt, endedAt), options);
export const useDefaultServiceTagsControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof DefaultService.tagsControllerCreate>>, unknown, {
    requestBody: CreateTagDto;
}, unknown>, "mutationFn">) => useMutation(({ requestBody }) => DefaultService.tagsControllerCreate(requestBody), options);
export const useDefaultServiceTagsControllerFindAllKey = "DefaultServiceTagsControllerFindAll";
export const useDefaultServiceTagsControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ startedAt, endedAt }: {
    startedAt: string;
    endedAt: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof DefaultService.tagsControllerFindAll>>, unknown, Awaited<ReturnType<typeof DefaultService.tagsControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery([useDefaultServiceTagsControllerFindAllKey, ...(queryKey ?? [{ startedAt, endedAt }])], () => DefaultService.tagsControllerFindAll(startedAt, endedAt), options);
export const useDefaultServiceTagsControllerRemove = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof DefaultService.tagsControllerRemove>>, unknown, {
    id: string;
}, unknown>, "mutationFn">) => useMutation(({ id }) => DefaultService.tagsControllerRemove(id), options);
export const useDefaultServiceTagNamesControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof DefaultService.tagNamesControllerCreate>>, unknown, {
    requestBody: CreateTagNameDto;
}, unknown>, "mutationFn">) => useMutation(({ requestBody }) => DefaultService.tagNamesControllerCreate(requestBody), options);
export const useDefaultServiceTagNamesControllerFindAllKey = "DefaultServiceTagNamesControllerFindAll";
export const useDefaultServiceTagNamesControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ term }: {
    term?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof DefaultService.tagNamesControllerFindAll>>, unknown, Awaited<ReturnType<typeof DefaultService.tagNamesControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery([useDefaultServiceTagNamesControllerFindAllKey, ...(queryKey ?? [{ term }])], () => DefaultService.tagNamesControllerFindAll(term), options);
export const useDefaultServiceTagNamesControllerCountKey = "DefaultServiceTagNamesControllerCount";
export const useDefaultServiceTagNamesControllerCount = <TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof DefaultService.tagNamesControllerCount>>, unknown, Awaited<ReturnType<typeof DefaultService.tagNamesControllerCount>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery([useDefaultServiceTagNamesControllerCountKey, ...(queryKey ?? [])], () => DefaultService.tagNamesControllerCount(), options);
