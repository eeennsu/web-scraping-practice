import { requestSearchedProductList } from '@/entities/product'
import { converAmazonLink } from '@/shared/utils'
import { SearchedKeyword, SearchedProducts } from '@/widgets/search'

import type { FC } from 'react'

interface Props {
    searchParams: {
        [key: string]: string | undefined
    }
}

const SearchPage: FC<Props> = async ({ searchParams }) => {
    const keyword = searchParams?.q

    if (!keyword) {
        throw new Error('Keyword is required.')
    }

    const amazonSearchedLink = converAmazonLink(keyword)
    const searchedProducts =
        await requestSearchedProductList(amazonSearchedLink)

    return (
        <>
            <SearchedKeyword keyword={keyword} />
            {!!searchedProducts && (
                <SearchedProducts products={searchedProducts} />
            )}
        </>
    )
}

export default SearchPage
