import { ApiProperty } from "@nestjs/swagger";

export class PaginatedDTO<TData> {
    @ApiProperty()
    total: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    offset: number;

    result: TData[];
}