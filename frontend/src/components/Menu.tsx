import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      // {
      //   icon: "/teacher.png",
      //   label: "Teachers",
      //   href: "/list/teachers",
      //   visible: ["admin", "teacher"],
      // },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/dashboard/subjects",
        visible: ["admin"],
      },
      {
        icon: "/exam.png",
        label: "Quiz",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      // {
      //   icon: "/student.png",
      //   label: "Students",
      //   href: "/list/students",
      //   visible: ["admin", "teacher"],
      // },
      // {
      //   icon: "/parent.png",
      //   label: "Parents",
      //   href: "/list/parents",
      //   visible: ["admin", "teacher"],
      // },
      // {
      //   icon: "/class.png",
      //   label: "Classes",
      //   href: "/list/classes",
      //   visible: ["admin", "teacher"],
      // },
      // {
      //   icon: "/assignment.png",
      //   label: "Assignments",
      //   href: "/list/assignments",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      {
        icon: "/result.png",
        label: "Analysis History",
        href: "/dashboard/analysis-history",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/lesson.png",
        label: "Progress",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/list/attendance",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/calendar.png",
      //   label: "Events",
      //   href: "/list/events",
      //   visible: ["admin", "teacher", "student", "parent"],
      //},
      // {
      //   icon: "/message.png",
      //   label: "Messages",
      //   href: "/list/messages",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/announcement.png",
      //   label: "Announcements",
      //   href: "/list/announcements",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];
const Menu = () => {
  return (
    <div className="mt-4 text-sm p-5">
      {menuItems.map(i=>(
        <div className="flex flex-col gap-2 " key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
          {i.items.map(item=>(
           <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 tex-grey-500 py-2"> 
           <Image src={item.icon} alt="" width={20} height={20}/>
           <span className="hidden lg:block">{item.label}</span>
           </Link>
          ))}
        </div>
      ))}
      </div>
  )
}
export default Menu;