'use client'

import type { FC } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignUpSchema } from '@/entities/user/user.zod'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { UserSignUpType, signUpUser } from '@/entities/user'
import {
    Form as FormProvider,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form'

export const SignUpForm: FC = () => {
    const navigate = useRouter()

    const form = useForm({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
            username: '',
        },
    })

    const onSubmit = (data: UserSignUpType) => {
        if (data.password !== data.passwordConfirmation) {
            form.setError('passwordConfirmation', {
                message: 'Passwords do not match',
            })

            return
        }

        try {
            signUpUser(data.email, data.password, data.username)
        } catch (error) {
            console.error(error)
            navigate.refresh()
        }
    }

    return (
        <section className='w-full flex'>
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-6 w-full'
                >
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='username'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder='username@email.com'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='passwordConfirmation'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password Confirmation</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='password confirmation'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type='submit'>Submit</Button>
                </form>
            </FormProvider>
        </section>
    )
}
