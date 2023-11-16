import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { UpdateTagNameDto } from "../requests/models/UpdateTagNameDto";
import { UpdateTagDto } from "../requests/models/UpdateTagDto";
import { UpdateAutoTagsDto } from "../requests/models/UpdateAutoTagsDto";
import { TagNameDto } from "../requests/models/TagNameDto";
import { TagDto } from "../requests/models/TagDto";
import { CreateTagNameDto } from "../requests/models/CreateTagNameDto";
import { CreateTagDto } from "../requests/models/CreateTagDto";
import { CreateAutoTagDto } from "../requests/models/CreateAutoTagDto";
import { AutoTagDto } from "../requests/models/AutoTagDto";
import { AutoTagConditionDto } from "../requests/models/AutoTagConditionDto";
import { TagsService } from "../requests/services/TagsService";
import { TagNamesService } from "../requests/services/TagNamesService";
import { StatusService } from "../requests/services/StatusService";
import { AutoTagsService } from "../requests/services/AutoTagsService";
import { ActivitiesService } from "../requests/services/ActivitiesService";
export const useTagsServiceTagsControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof TagsService.tagsControllerCreate>>, unknown, {
    requestBody: CreateTagDto;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ requestBody }) => TagsService.tagsControllerCreate(requestBody), ...options });
export const useTagsServiceTagsControllerFindAllKey = "TagsServiceTagsControllerFindAll";
export const useTagsServiceTagsControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ startedAt, endedAt }: {
    startedAt: string;
    endedAt: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof TagsService.tagsControllerFindAll>>, unknown, Awaited<ReturnType<typeof TagsService.tagsControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useTagsServiceTagsControllerFindAllKey, ...(queryKey ?? [{ startedAt, endedAt }])], queryFn: () => TagsService.tagsControllerFindAll(startedAt, endedAt), ...options });
export const useTagsServiceTagsControllerFindOneKey = "TagsServiceTagsControllerFindOne";
export const useTagsServiceTagsControllerFindOne = <TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof TagsService.tagsControllerFindOne>>, unknown, Awaited<ReturnType<typeof TagsService.tagsControllerFindOne>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useTagsServiceTagsControllerFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => TagsService.tagsControllerFindOne(id), ...options });
export const useTagsServiceTagsControllerUpdate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof TagsService.tagsControllerUpdate>>, unknown, {
    id: string;
    requestBody: UpdateTagDto;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id, requestBody }) => TagsService.tagsControllerUpdate(id, requestBody), ...options });
export const useTagsServiceTagsControllerRemove = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof TagsService.tagsControllerRemove>>, unknown, {
    id: string;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id }) => TagsService.tagsControllerRemove(id), ...options });
export const useTagNamesServiceTagNamesControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof TagNamesService.tagNamesControllerCreate>>, unknown, {
    requestBody: CreateTagNameDto;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ requestBody }) => TagNamesService.tagNamesControllerCreate(requestBody), ...options });
export const useTagNamesServiceTagNamesControllerFindAllKey = "TagNamesServiceTagNamesControllerFindAll";
export const useTagNamesServiceTagNamesControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ term }: {
    term?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof TagNamesService.tagNamesControllerFindAll>>, unknown, Awaited<ReturnType<typeof TagNamesService.tagNamesControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useTagNamesServiceTagNamesControllerFindAllKey, ...(queryKey ?? [{ term }])], queryFn: () => TagNamesService.tagNamesControllerFindAll(term), ...options });
export const useTagNamesServiceTagNamesControllerCountKey = "TagNamesServiceTagNamesControllerCount";
export const useTagNamesServiceTagNamesControllerCount = <TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof TagNamesService.tagNamesControllerCount>>, unknown, Awaited<ReturnType<typeof TagNamesService.tagNamesControllerCount>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useTagNamesServiceTagNamesControllerCountKey, ...(queryKey ?? [])], queryFn: () => TagNamesService.tagNamesControllerCount(), ...options });
export const useTagNamesServiceTagNamesControllerFindOneKey = "TagNamesServiceTagNamesControllerFindOne";
export const useTagNamesServiceTagNamesControllerFindOne = <TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof TagNamesService.tagNamesControllerFindOne>>, unknown, Awaited<ReturnType<typeof TagNamesService.tagNamesControllerFindOne>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useTagNamesServiceTagNamesControllerFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => TagNamesService.tagNamesControllerFindOne(id), ...options });
export const useTagNamesServiceTagNamesControllerUpdate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof TagNamesService.tagNamesControllerUpdate>>, unknown, {
    id: string;
    requestBody: UpdateTagNameDto;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id, requestBody }) => TagNamesService.tagNamesControllerUpdate(id, requestBody), ...options });
export const useTagNamesServiceTagNamesControllerRemove = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof TagNamesService.tagNamesControllerRemove>>, unknown, {
    id: string;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id }) => TagNamesService.tagNamesControllerRemove(id), ...options });
export const useStatusServiceAppControllerStatusKey = "StatusServiceAppControllerStatus";
export const useStatusServiceAppControllerStatus = <TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof StatusService.appControllerStatus>>, unknown, Awaited<ReturnType<typeof StatusService.appControllerStatus>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useStatusServiceAppControllerStatusKey, ...(queryKey ?? [])], queryFn: () => StatusService.appControllerStatus(), ...options });
export const useAutoTagsServiceAutoTagsControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerCreate>>, unknown, {
    requestBody: CreateAutoTagDto;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ requestBody }) => AutoTagsService.autoTagsControllerCreate(requestBody), ...options });
export const useAutoTagsServiceAutoTagsControllerFindAllKey = "AutoTagsServiceAutoTagsControllerFindAll";
export const useAutoTagsServiceAutoTagsControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ term }: {
    term?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerFindAll>>, unknown, Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useAutoTagsServiceAutoTagsControllerFindAllKey, ...(queryKey ?? [{ term }])], queryFn: () => AutoTagsService.autoTagsControllerFindAll(term), ...options });
export const useAutoTagsServiceAutoTagsControllerCountKey = "AutoTagsServiceAutoTagsControllerCount";
export const useAutoTagsServiceAutoTagsControllerCount = <TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerCount>>, unknown, Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerCount>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useAutoTagsServiceAutoTagsControllerCountKey, ...(queryKey ?? [])], queryFn: () => AutoTagsService.autoTagsControllerCount(), ...options });
export const useAutoTagsServiceAutoTagsControllerFindOneKey = "AutoTagsServiceAutoTagsControllerFindOne";
export const useAutoTagsServiceAutoTagsControllerFindOne = <TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerFindOne>>, unknown, Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerFindOne>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useAutoTagsServiceAutoTagsControllerFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => AutoTagsService.autoTagsControllerFindOne(id), ...options });
export const useAutoTagsServiceAutoTagsControllerUpdate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerUpdate>>, unknown, {
    id: string;
    requestBody: UpdateAutoTagsDto;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id, requestBody }) => AutoTagsService.autoTagsControllerUpdate(id, requestBody), ...options });
export const useAutoTagsServiceAutoTagsControllerDelete = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof AutoTagsService.autoTagsControllerDelete>>, unknown, {
    id: string;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id }) => AutoTagsService.autoTagsControllerDelete(id), ...options });
export const useActivitiesServiceActivitiesControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof ActivitiesService.activitiesControllerCreate>>, unknown, void, unknown>, "mutationFn">) => useMutation({ mutationFn: () => ActivitiesService.activitiesControllerCreate(), ...options });
export const useActivitiesServiceActivitiesControllerFindAllKey = "ActivitiesServiceActivitiesControllerFindAll";
export const useActivitiesServiceActivitiesControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ startedAt, endedAt }: {
    startedAt: string;
    endedAt: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof ActivitiesService.activitiesControllerFindAll>>, unknown, Awaited<ReturnType<typeof ActivitiesService.activitiesControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery({ queryKey: [useActivitiesServiceActivitiesControllerFindAllKey, ...(queryKey ?? [{ startedAt, endedAt }])], queryFn: () => ActivitiesService.activitiesControllerFindAll(startedAt, endedAt), ...options });
export const useActivitiesServiceActivitiesControllerFindOne = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof ActivitiesService.activitiesControllerFindOne>>, unknown, {
    id: string;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id }) => ActivitiesService.activitiesControllerFindOne(id), ...options });
export const useActivitiesServiceActivitiesControllerDelete = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof ActivitiesService.activitiesControllerDelete>>, unknown, {
    id: string;
}, unknown>, "mutationFn">) => useMutation({ mutationFn: ({ id }) => ActivitiesService.activitiesControllerDelete(id), ...options });
