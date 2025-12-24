import { PageDto } from "src/common/dto/page.dto.";
import { PageMetaDto } from "src/common/dto/pageMeta.dto";
import { PageOptionsDto } from "src/common/dto/pageOptions.dto";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export default async function paginatedData<T extends ObjectLiteral>(
    pageOptionsDto: PageOptionsDto,
    queryBuilder: SelectQueryBuilder<T>
) {
    // const itemCount = await queryBuilder.getCount();
    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
}

export async function paginatedRawData<T extends ObjectLiteral>(
    pageOptionsDto: PageOptionsDto,
    queryBuilder: SelectQueryBuilder<T>
) {
    const itemCount = await queryBuilder.getCount();
    const data = await queryBuilder.getRawMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
}