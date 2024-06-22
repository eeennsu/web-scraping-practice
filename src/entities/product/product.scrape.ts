import type {
    TodaysDealsProductType,
    DetailProductType,
    SearchedProductType,
    CarouselProductImageType,
} from './product.types'
import type { CheerioAPI } from 'cheerio'
import {
    extractDescriptions,
    extractLastMonthPurchases,
    extractPrice,
    extractSearchedProductPrice,
} from '@/shared/utils'

export const scrapeAmazonProductsImages = (
    $: CheerioAPI
): CarouselProductImageType[] => {
    const amazonProductsImages: CarouselProductImageType[] = []

    $('img._fluid-quad-image-label-v2_style_fluidLandscapeImage__2euAK').each(
        (_, el) => {
            const element = $(el)

            let image = element.attr('data-a-hires') || element.attr('src')
            const url = element.closest('a').attr('href')

            if (amazonProductsImages.length >= 5) {
                return false
            }

            if (image) {
                image = image.replace(
                    /_SX\d+_|_UX\d+_|_SY\d+_|_UY\d+_/,
                    '_SX1500_'
                )
            }

            if (image) {
                amazonProductsImages.push({
                    image,
                    url: `https://www.amazon.com${url}`,
                })
            }
        }
    )

    return amazonProductsImages
}

export const scrapeTodaysDealsProductList = (
    $: CheerioAPI
): TodaysDealsProductType[] => {
    const todaysDealsProductList: TodaysDealsProductType[] = []

    $('div[data-testid="virtuoso-item-list"] div[data-test-index]').each(
        (_, el) => {
            const element = $(el)

            const id = element.attr('data-testid')?.trim()

            const title = element
                .find('.ProductCard-module__title_awabIOxk6xfKvxKcdKDH')
                .text()
                .trim()

            const imageElement = element.find(
                'img.ProductCardImage-module__image_SU6C7KYJpko3vQ2fK7Kf'
            )

            const image =
                imageElement.attr('data-a-hires') || imageElement.attr('src')

            const url = element.find('a').attr('href')

            const discountedPercent = element
                .find(
                    'div[data-component="dui-badge"] div.style_badgeLabel__dD0Hv'
                )
                .text()
                .trim()

            const avaliableCoupon = element
                .find('div[data-component="dui-coupon-badge"]')
                .text()
                .trim()

            const todaysDealsProduct: TodaysDealsProductType = {
                id,
                title,
                discountedPercent,
                avaliableCoupon,
                image,
                url,
            }

            todaysDealsProductList.push(todaysDealsProduct)
        }
    )

    return todaysDealsProductList
}

export const scrapeSearchedAmazonProductList = (
    $: CheerioAPI
): SearchedProductType[] => {
    const searchedProducts: SearchedProductType[] = []

    $('div[data-component-type="s-search-result"]').each((i, el) => {
        const element = $(el)

        const id =
            element.attr('data-uuid')?.trim() ||
            element.attr('data-asin')?.trim()

        const title = element
            .find('div.s-title-instructions-style')
            .text()
            .trim()
        const image = element.find('img.s-image').attr('src')
        const url = element.find('a.a-link-normal').attr('href')

        const membership = element
            .find('div[data-cy="secondary-offer-recipe"] span')
            .first()
            .text()
            .trim()

        const price = extractSearchedProductPrice(element) || null

        const rating = element
            .find('span.a-icon-alt')
            .text()
            .trim()
            .split(' ')
            ?.at(0)

        const stock =
            element
                .find('div[data-cy="delivery-recipe"] span:contains("Only")')
                .first()
                .text()
                .trim()
                .split(' ')
                ?.at(1) || null

        const lastMonthPurchases = extractLastMonthPurchases(element)

        const searchedProduct: SearchedProductType = {
            id,
            title,
            image,
            url,
            membership: membership.includes('Prime') ? membership : null,
            price,
            rating,
            stock,
            lastMonthPurchases,
        }

        if (id) {
            searchedProducts.push(searchedProduct)
        }
    })

    return searchedProducts
}

export const scrapeDetailAmazonProduct = ($: CheerioAPI): DetailProductType => {
    const id = $('[data-component-type="s-search-result"]')
        .first()
        .attr('data-asin')

    const title = $('#productTitle').text().trim()

    const discountedPrice = extractPrice(
        $('span.a-price span.a-offscreen'),
        $('.priceToPay span.a-price-whole'),
        $('a.size.base .a-color-price'),
        $('.a-button-selected .a-color-base'),
        $('.a-price.a-text-price')
    )

    const originalPrice = extractPrice(
        $('#priceblock_ourprice'),
        $('.a-price.a-text-price span.a-offscreen'),
        $('#listPrice'),
        $('#priceblock_dealprice'),
        $('.a-size-base.a-color-price')
    )
    const discountedPercent = +$('.savingPercentage')
        .text()
        .replace(/[-%]/g, '')

    const currency = $('.a-price-symbol').text().trim().slice(0, 1)

    const availabilty = $('#availability').text().trim().toLocaleLowerCase()

    const imageElements =
        $('#imglbkFront').attr('data-a-dynamic-image') ||
        $('#landingImage').attr('data-a-dynamic-image')

    const image = Object.keys(JSON.parse(imageElements || '{}'))?.at(0)

    const descriptions = extractDescriptions($('#feature-bullets'))

    const rating = $('#acrPopover')
        .attr('title')
        ?.match(/[\d.]+/)
        ?.at(0)

    const brand = $('#bylineInfo').text().trim().split(' ')?.at(2)

    const amazonProduct: DetailProductType = {
        id,
        title,
        price: {
            discountedPrice,
            discountedPercent,
            originalPrice,
            currency: currency || '$',
        },
        image,
        descriptions,
        isAvaliable: availabilty === 'in stock',
        brand,
        rating,
    }

    return amazonProduct
}
