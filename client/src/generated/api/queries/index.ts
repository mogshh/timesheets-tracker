import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { DefaultService } from "..\\requests\\services\\DefaultService";
export const useDefaultServiceAppControllerStatusKey = "DefaultServiceAppControllerStatus";
export const useDefaultServiceAppControllerStatus = <TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof DefaultService.appControllerStatus>>, unknown, Awaited<ReturnType<typeof DefaultService.appControllerStatus>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery([useDefaultServiceAppControllerStatusKey, ...(queryKey ?? [])], () => DefaultService.appControllerStatus(), options);
export const useDefaultServiceActivitiesControllerCreate = (options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof DefaultService.activitiesControllerCreate>>, unknown, void, unknown>, "mutationFn">) => useMutation(() => DefaultService.activitiesControllerCreate(), options);
export const useDefaultServiceActivitiesControllerFindAllKey = "DefaultServiceActivitiesControllerFindAll";
export const useDefaultServiceActivitiesControllerFindAll = <TQueryKey extends Array<unknown> = unknown[]>({ startedAt, endedAt }: {
    startedAt: string;
    endedAt: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof DefaultService.activitiesControllerFindAll>>, unknown, Awaited<ReturnType<typeof DefaultService.activitiesControllerFindAll>>, unknown[]>, "queryKey" | "queryFn" | "initialData">) => useQuery([useDefaultServiceActivitiesControllerFindAllKey, ...(queryKey ?? [{ startedAt, endedAt }])], () => DefaultService.activitiesControllerFindAll(startedAt, endedAt), options);
