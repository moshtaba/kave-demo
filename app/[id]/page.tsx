"use client"

import { url } from "@/util/url";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Detail({ params }: { params: { id: string } }) {
    const { isPending, error, data, isFetching } = useQuery({ 
        queryKey: ['posts'],
        queryFn: () => axios
            .get(`${url}/${params.id}`)
            .then((res) => res), 
        staleTime: 60 * 1000,
    })

    if (isPending || isFetching) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
            <h1 className="mb-3 text-2xl">{data.data.title}</h1>
            <p>
                {data.data.body}
            </p>
        </>
    );
}
