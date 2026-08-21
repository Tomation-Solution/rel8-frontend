import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiSend } from "react-icons/fi";

import Button from "./Button";
import Card from "./Card";
import IconInput, { IconTextarea } from "./Field";

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  title: string;
  description?: string;
  submitLabel?: string;
  isLoading?: boolean;
  onSubmit: (values: ContactFormValues) => void;
  /** Prefills the two identity fields from the signed-in member. */
  defaults?: Partial<ContactFormValues>;
}

/**
 * The support contact form. One component for both Admin Support and Technical Support —
 * they were two files with the same form, the same validation and the same success handling,
 * differing only in which mutation they called.
 *
 * Both submit to `POST /api/tickets`. The older pages posted to `/contactus/technical/` and
 * `/contactus/admin/`, Django routes this backend never mounted, and still showed a success
 * state — see the header comment in `api/contactUs/contactUs.ts`.
 */
const ContactForm = ({ title, description, submitLabel = "Send message", isLoading = false, onSubmit, defaults }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: { name: defaults?.name ?? "", email: defaults?.email ?? "", message: "" },
  });

  return (
    <Card accent className="p-6 max-w-2xl">
      <h3 className="text-[18px] font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
        <IconInput label="Your name" icon={FiUser} placeholder="Enter your name" error={errors.name?.message} {...register("name", { required: "Please tell us your name" })} />

        <IconInput
          label="Email address"
          icon={FiMail}
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "We need an email to reply to",
            pattern: { value: /\S+@\S+\.\S+/, message: "That doesn't look like an email address" },
          })}
        />

        <IconTextarea label="Message" rows={6} placeholder="How can we help?" error={errors.message?.message} {...register("message", { required: "Please write your message", minLength: { value: 10, message: "A little more detail, please" } })} />

        <div>
          <Button htmlType="submit" icon={FiSend} isLoading={isLoading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContactForm;
