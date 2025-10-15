// Shared translations and helper for pages that need i18n on the client side
const translations = {
    en: {
        app_title: "BScheduler",
        manager_dashboard: "Manager Dashboard",
        manage_your_employees: "Manage your employees and create schedules",
        add_employee: "Add Employee",
        create_schedule: "Create Schedule",
        your_employees: "Your Employees",
        loading: "Loading...",
        no_employees_yet_title: "No Employees Yet",
        no_employees_yet_text: "Add your first employee to get started",
        employee_name: "Employee Name",
        employment_type: "Employment Type",
        part_time: "Part-time",
        full_time: "Full-time",
        min_hours_week: "Min Hours/Week",
        max_hours_week: "Max Hours/Week",
        hourly_wage: "Hourly Wage",
        can_be_responsible: "Can be responsible person",
        create_login_account: "Create login account for this employee",
        username: "Username",
        password: "Password",
        employee_can_login_info: "Employee can log in to set their own availability",
        cancel: "Cancel",
        save_employee: "Save Employee",
    save_availability: "Save Availability",
        edit: "Edit",
        delete: "Delete",
        fulltime_badge: "Full-time",
        parttime_badge: "Part-time",
        responsible_badge: "Responsible",
        has_account: "Has Account",
        no_account: "No Account",
        min_label: "Min:",
        max_label: "Max:",
        confirm_delete: "Are you sure you want to delete %s? This action cannot be undone.",
        please_provide_username_password: "Please provide username and password"
        ,logout: "Log out"
        ,monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
        friday: "Friday", saturday: "Saturday", sunday: "Sunday",
        mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
        morning: "Morning", afternoon: "Afternoon", evening: "Evening",
        employee: "Employee",
        availability_for: "Availability",
    availability_info: "Select the days and shifts you are available to work. Your manager will use this information when creating schedules.",
        weekly_hours: "Weekly Hours",
        min_hours: "Min Hours",
        max_hours: "Max Hours",
        unlimited: "Unlimited",
        fulltime: "Full-time",
        hourly_wage: "Hourly Wage",
        apply_to_all: "Apply to all employees (except full-time)",
        can_be_responsible: "Can be a responsible person",
        shift_name: "Shift Name",
        hours: "Hours",
        apply_same_minmax_all: "Apply same min/max to all shifts and days",
        apply_same_minmax_per_shift: "Apply same min/max per shift to every day",
        minimum_employees: "Minimum Employees",
        maximum_employees: "Maximum Employees",
        ignore_min_constraint: "Ignore minimum constraint",
        ignore_max_constraint: "Ignore maximum constraint",
        set_minmax_per_shift: "Set min/max per shift type (applies to all days):",
        set_minmax_each_shift: "Set min/max employees for each shift (0 to ignore):",
        min: "Min",
        max: "Max",
        fulltime_hours_label: "Working hours for a full-time worker (per week)",
        set_zero_ignore: "Set to 0 to ignore",
        require_responsible: "At least one responsible per shift",
        shift: "Shift"
        ,please_select_days_shifts: "Please select days and define shifts first."
        ,please_define_shifts: "Please define shifts first."
        ,must_have_one_shift: "You must have at least one shift defined."
        ,must_have_one_employee: "You must have at least one employee."
        ,no_employees_assigned: "No employees assigned"
        ,
        // landing/index specific keys
        hero_subtitle: "Workforce scheduling tailored to horeca sector in Belgium. Save time, reduce costs, and keep your team happy.",
        login_signup_btn: "Login / Sign Up",
        try_guest_btn: "Try Without Account",
        features_title: "Powerful Features",
        features_subtitle: "Everything you need to create optimal work schedules in minutes",
        feature1_title: "Flexible Employment Types",
        feature1_desc: "Both full-time and flexible contract workers are considered in the scheduling engine.",
        feature2_title: "Employee Availability",
        feature2_desc: "Track employee availability, set minimum and maximum work hours, manage hourly wages, and ensure responsible staff coverage.",
        feature3_title: "Flexible Shift Management",
        feature3_desc: "Define custom shifts with different durations, set working days, and configure staffing requirements for each shift type.",
        feature4_title: "Cost Minimalization",
        feature4_desc: "Advanced algorithms automatically generate optimal schedules that minimize costs while meeting all your requirements and constraints.",
        feature5_title: "Cost Analysis",
        feature5_desc: "Get instant cost calculations for your schedules, helping you make informed decisions and optimize labor expenses.",
        feature6_title: "Save & Reload",
        feature6_desc: "Create an account to save your schedules and access them anytime, anywhere. Never lose your work again!",
        mission_title: "Our Mission & Goals",
        goals_subtitle: "Making workforce scheduling simple, efficient, and stress-free for businesses of all sizes",
        goal1_title: "Simplify Complex Scheduling",
        goal1_desc: "Transform the traditionally complex task of workforce scheduling into a simple, intuitive 2-step process that anyone can master in minutes.",
        goal2_title: "Reduce Labor Costs",
        goal2_desc: "Help businesses optimize their labor costs through intelligent scheduling that balances employee availability, working hours, and wage considerations.",
        goal3_title: "Improve Employee Satisfaction",
        goal3_desc: "Respect employee availability and working hour preferences, leading to happier staff, reduced turnover, and better workplace morale.",
        goal4_title: "Save Valuable Time",
        goal4_desc: "Eliminate hours of manual schedule creation and adjustment. What used to take hours can now be done in minutes with optimal results.",
        goal5_title: "Ensure Compliance & Coverage",
        goal5_desc: "Automatically ensure minimum staffing requirements are met, responsible persons are assigned, and all business constraints are satisfied.",
        cta_title: "Ready to Transform Your Scheduling?",
        cta_subtitle: "Join businesses using BScheduler to optimize their workforce",
        create_account_btn: "Create Free Account",
        start_scheduling_btn: "Start Scheduling Now",
        footer_text: "BScheduler © 2025",
        confidentiality_note: "Input data is confidential and will not be shared.",
        // index/wizard specific
        step1_label: "Time Details",
        step2_label: "Employee Details",
        step1_title: "Step 1: Configure Time Settings",
        step1_desc: "Set up your working days, shifts, and scheduling requirements",
        step2_title: "Step 2: Configure Employees",
        step2_desc: "Add employees and set their availability, hours, and wages",
        continue_btn: "Continue to Employee Details",
        add_shift: "Add Shift",
        shift_config: "Shift Configuration",
        working_days: "Working Days",
        staffing_req: "Staffing Requirements",
        additional_settings: "Additional Settings",
        back_btn: "Back to Time Details",
        generate_btn: "Generate Schedule",
        login_subtitle: "Access your account or create a new one",
        signup_tab: "Sign Up",
        username_label: "Username",
        password_label: "Password",
        login_btn: "Login",
        min3: "Minimum 3 characters",
        min6: "Minimum 6 characters",
        email_label: "Email (optional)",
        confirm_password_label: "Confirm Password",
        or: "OR",
        continue_guest: "Continue as Guest",
        back_home: "Back to Home"
    },
    // include other languages used in the app (fr, vi, nl) with the same keys
    fr: {
        app_title: "BScheduler",
        manager_dashboard: "Tableau de bord",
        manage_your_employees: "Gérez vos employés et créez des plannings",
        add_employee: "Ajouter un Employé",
        create_schedule: "Créer un planning",
        your_employees: "Vos Employés",
        loading: "Chargement...",
        no_employees_yet_title: "Aucun employé",
        no_employees_yet_text: "Ajoutez votre premier employé pour commencer",
        employee_name: "Nom de l'employé",
        employment_type: "Type d'emploi",
        part_time: "Temps partiel",
        full_time: "Temps plein",
        min_hours_week: "Heures Min/ Semaine",
        max_hours_week: "Heures Max/ Semaine",
        hourly_wage: "Salaire Horaire",
        can_be_responsible: "Peut être responsable",
        create_login_account: "Créer un compte pour cet employé",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        employee_can_login_info: "L'employé peut se connecter pour définir sa disponibilité",
        cancel: "Annuler",
        save_employee: "Enregistrer",
    save_availability: "Enregistrer la disponibilité",
        edit: "Modifier",
        delete: "Supprimer",
        fulltime_badge: "Temps plein",
        parttime_badge: "Temps partiel",
        responsible_badge: "Responsable",
        has_account: "Compte existant",
        no_account: "Pas de compte",
        min_label: "Min:",
        max_label: "Max:",
        confirm_delete: "Voulez-vous vraiment supprimer %s ? Cette action est irréversible.",
        please_provide_username_password: "Veuillez fournir un nom d'utilisateur et un mot de passe"
        ,logout: "Se déconnecter"
        ,monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi", thursday: "Jeudi",
        friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche",
        mon: "Lun", tue: "Mar", wed: "Mer", thu: "Jeu", fri: "Ven", sat: "Sam", sun: "Dim",
        morning: "Matin", afternoon: "Après-midi", evening: "Soir",
        employee: "Employé",
        availability_for: "Disponibilité",
    availability_info: "Sélectionnez les jours et les postes où vous êtes disponible. Votre responsable utilisera ces informations pour établir les plannings.",
        weekly_hours: "Heures Hebdomadaires",
        min_hours: "Heures Min",
        max_hours: "Heures Max",
        unlimited: "Illimité",
        fulltime: "Temps plein",
        hourly_wage: "Salaire Horaire",
        apply_to_all: "Appliquer à tous les employés (sauf temps plein)",
        can_be_responsible: "Peut être responsable",
        shift_name: "Nom du Poste",
        hours: "Heures",
        apply_same_minmax_all: "Appliquer le même min/max à tous les postes et jours",
        apply_same_minmax_per_shift: "Appliquer le même min/max par poste à chaque jour",
        minimum_employees: "Employés Minimum",
        maximum_employees: "Employés Maximum",
        ignore_min_constraint: "Ignorer la contrainte minimum",
        ignore_max_constraint: "Ignorer la contrainte maximum",
        set_minmax_per_shift: "Définir min/max par type de poste (s'applique à tous les jours):",
        set_minmax_each_shift: "Définir min/max employés pour chaque poste (0 pour ignorer):",
        min: "Min",
        max: "Max",
        fulltime_hours_label: "Heures de travail pour un employé à temps plein (par semaine)",
        set_zero_ignore: "Mettre à 0 pour ignorer",
        require_responsible: "Au moins d'un/une responsable par poste",
        shift: "Poste"
        ,please_select_days_shifts: "Veuillez sélectionner les jours et définir les postes d'abord."
        ,please_define_shifts: "Veuillez définir les postes d'abord."
        ,must_have_one_shift: "Vous devez avoir au moins un poste défini."
        ,must_have_one_employee: "Vous devez avoir au moins un employé."
        ,no_employees_assigned: "Aucun employé assigné"
    ,
    hero_subtitle: "Planification du personnel pour le secteur horeca en Belgique. Gagnez du temps, réduisez les coûts et gardez votre équipe heureuse.",
    login_signup_btn: "Connexion / Inscription",
    try_guest_btn: "Essayer sans compte",
    features_title: "Fonctionnalités puissantes",
    features_subtitle: "Tout ce dont vous avez besoin pour créer des plannings optimaux en quelques minutes",
    feature1_title: "Types d'emploi flexibles",
    feature1_desc: "Les travailleurs à temps plein et en contrat flexible sont pris en compte dans le moteur de planification.",
    feature2_title: "Disponibilité des employés",
    feature2_desc: "Suivez la disponibilité, définissez des heures min/max et gérez les salaires horaires.",
    feature3_title: "Gestion flexible des postes",
    feature3_desc: "Définissez des postes personnalisés avec des durées différentes et configurez les besoins en personnel.",
    feature4_title: "Minimisation des coûts",
    feature4_desc: "Des algorithmes avancés génèrent des plannings optimaux qui minimisent les coûts.",
    feature5_title: "Analyse des coûts",
    feature5_desc: "Obtenez des calculs instantanés des coûts pour vos plannings.",
    feature6_title: "Sauvegarder & Recharger",
    feature6_desc: "Créez un compte pour sauvegarder vos plannings et y accéder à tout moment.",
    mission_title: "Notre mission & objectifs",
    goals_subtitle: "Simplifier, rendre efficace et sans stress la planification pour toutes les entreprises",
    goal1_title: "Simplifier la planification complexe",
    goal1_desc: "Transformer la planification complexe en un processus simple en 2 étapes.",
    goal2_title: "Réduire les coûts salariaux",
    goal2_desc: "Optimiser les coûts salariaux grâce à une planification intelligente.",
    goal3_title: "Améliorer la satisfaction des employés",
    goal3_desc: "Respecter la disponibilité et les préférences pour un meilleur moral.",
    goal4_title: "Gagner du temps précieux",
    goal4_desc: "Réduire des heures de travail manuel en minutes.",
    goal5_title: "Assurer la conformité & la couverture",
    goal5_desc: "Garantir le minimum de personnel requis et l'affectation des responsables.",
    cta_title: "Prêt à transformer votre planification ?",
    cta_subtitle: "Rejoignez les entreprises qui utilisent BScheduler",
    create_account_btn: "Créer un compte gratuit",
    start_scheduling_btn: "Commencer à planifier",
    footer_text: "BScheduler © 2025",
    confidentiality_note: "Les données saisies sont confidentielles et ne seront pas partagées.",
    step1_label: "Détails temporels",
    step2_label: "Détails des employés",
    step1_title: "Étape 1 : Configurer les paramètres temporels",
    step1_desc: "Définissez vos jours de travail, postes et exigences de planification",
    step2_title: "Étape 2 : Configurer les employés",
    step2_desc: "Ajoutez des employés et définissez leur disponibilité, heures et salaires",
    continue_btn: "Continuer vers les détails des employés",
    add_shift: "Ajouter un poste",
    shift_config: "Configuration des postes",
    working_days: "Jours de travail",
    staffing_req: "Exigences en personnel",
    additional_settings: "Paramètres supplémentaires",
    back_btn: "Retour aux détails temporels",
    generate_btn: "Générer le planning",
    login_subtitle: "Accédez à votre compte ou créez-en un",
    signup_tab: "S'inscrire",
    username_label: "Nom d'utilisateur",
    password_label: "Mot de passe",
    login_btn: "Connexion",
    min3: "Minimum 3 caractères",
    min6: "Minimum 6 caractères",
    email_label: "Email (optionnel)",
    confirm_password_label: "Confirmer le mot de passe",
    or: "OU",
    continue_guest: "Continuer en tant qu'invité",
    back_home: "Retour à l'accueil"
    },
    vi: {
        app_title: "BScheduler",
        manager_dashboard: "Bảng quản lý",
        manage_your_employees: "Quản lý nhân viên và tạo lịch",
        add_employee: "Thêm nhân viên",
        create_schedule: "Tạo lịch",
        your_employees: "Nhân viên của bạn",
        loading: "Đang tải...",
        no_employees_yet_title: "Chưa có nhân viên",
        no_employees_yet_text: "Thêm nhân viên đầu tiên để bắt đầu",
        employee_name: "Tên nhân viên",
        employment_type: "Loại tuyển dụng",
        part_time: "Bán thời gian",
        full_time: "Toàn thời gian",
        min_hours_week: "Giờ Tối Thiểu/ Tuần",
        max_hours_week: "Giờ Tối Đa/ Tuần",
        hourly_wage: "Lương Theo Giờ",
        can_be_responsible: "Có thể là người chịu trách nhiệm",
        create_login_account: "Tạo tài khoản đăng nhập cho nhân viên này",
        username: "Tên đăng nhập",
        password: "Mật khẩu",
        employee_can_login_info: "Nhân viên có thể đăng nhập để đặt khả năng làm việc",
        cancel: "Hủy",
        save_employee: "Lưu nhân viên",
    save_availability: "Lưu thời gian sẵn sàng",
        edit: "Sửa",
        delete: "Xóa",
        fulltime_badge: "Toàn thời gian",
        parttime_badge: "Bán thời gian",
        responsible_badge: "Quản lý",
        has_account: "Có tài khoản",
        no_account: "Không có tài khoản",
        min_label: "Min:",
        max_label: "Max:",
        confirm_delete: "Bạn có chắc chắn muốn xóa %s? Hành động này không thể hoàn tác.",
        please_provide_username_password: "Vui lòng cung cấp tên đăng nhập và mật khẩu"
        ,logout: "Đăng xuất"
        ,monday: "Thứ Hai", tuesday: "Thứ Ba", wednesday: "Thứ Tư", thursday: "Thứ Năm",
        friday: "Thứ Sáu", saturday: "Thứ Bảy", sunday: "Chủ Nhật",
        mon: "T2", tue: "T3", wed: "T4", thu: "T5", fri: "T6", sat: "T7", sun: "CN",
        morning: "Sáng", afternoon: "Chiều", evening: "Tối",
        employee: "Nhân Viên",
        availability_for: "Lịch rảnh",
    availability_info: "Chọn các ngày và ca mà bạn có thể làm. Quản lý sẽ sử dụng thông tin này khi tạo lịch.",
        weekly_hours: "Giờ Hàng Tuần",
        min_hours: "Giờ Tối Thiểu",
        max_hours: "Giờ Tối Đa",
        unlimited: "Không giới hạn",
        fulltime: "Toàn thời gian",
        hourly_wage: "Lương Theo Giờ",
        apply_to_all: "Áp dụng cho tất cả nhân viên (trừ toàn thời gian)",
        can_be_responsible: "Có thể là quản lý",
        shift_name: "Tên Ca Làm",
        hours: "Giờ",
        apply_same_minmax_all: "Áp dụng cùng min/max cho tất cả ca làm và ngày",
        apply_same_minmax_per_shift: "Áp dụng cùng min/max cho mỗi ca làm cho mỗi ngày",
        minimum_employees: "Nhân Viên Tối Thiểu",
        maximum_employees: "Nhân Viên Tối Đa",
        ignore_min_constraint: "Bỏ qua ràng buộc tối thiểu",
        ignore_max_constraint: "Bỏ qua ràng buộc tối đa",
        set_minmax_per_shift: "Đặt min/max cho mỗi loại ca làm (áp dụng cho tất cả các ngày):",
        set_minmax_each_shift: "Đặt min/max nhân viên cho mỗi ca làm (0 để bỏ qua):",
        min: "Min",
        max: "Max",
        fulltime_hours_label: "Giờ làm việc cho nhân viên toàn thời gian (mỗi tuần)",
        set_zero_ignore: "Đặt thành 0 để bỏ qua",
        require_responsible: "Ít nhất một quản lý trong mỗi ca làm",
        shift: "Ca Làm"
        ,please_select_days_shifts: "Vui lòng chọn ngày và định nghĩa ca làm trước.",
        please_define_shifts: "Vui lòng định nghĩa ca làm trước.",
        must_have_one_shift: "Bạn phải có ít nhất một ca làm được định nghĩa.",
        must_have_one_employee: "Bạn phải có ít nhất một nhân viên.",
        no_employees_assigned: "Không có nhân viên được phân công"
        ,
        hero_subtitle: "Sắp xếp lịch làm việc cho nhân viên cho ngành dịch vụ tại Bỉ. Tiết kiệm thời gian, giảm chi phí và giữ đội ngũ của bạn hài lòng.",
        login_signup_btn: "Đăng nhập / Đăng ký",
        try_guest_btn: "Bắt đầu ngay",
        features_title: "Tính năng",
        features_subtitle: "Mọi thứ bạn cần để tạo lịch làm việc tối ưu trong vài phút",
        feature1_title: "Hỗ trợ nhiều loại hợp đồng",
        feature1_desc: "Cân nhắc cả nhân viên toàn thời gian và bán thời gian khi lên lịch.",
        feature2_title: "Sẵn sàng của nhân viên",
        feature2_desc: "Theo dõi khả năng làm việc, đặt giờ tối thiểu/tối đa và quản lý lương theo giờ.",
        feature3_title: "Quản lý ca linh hoạt",
        feature3_desc: "Định nghĩa ca tùy chỉnh với thời lượng khác nhau và cấu hình yêu cầu nhân sự.",
        feature4_title: "Giảm thiểu chi phí",
        feature4_desc: "Thuật toán nâng cao tự động tạo các lịch tối ưu nhằm giảm chi phí.",
        feature5_title: "Phân tích chi phí",
        feature5_desc: "Nhận tính toán chi phí ngay lập tức cho các lịch của bạn.",
        feature6_title: "Lưu & Tải lại",
        feature6_desc: "Tạo tài khoản để lưu lịch và truy cập bất cứ lúc nào.",
        mission_title: "Sứ mệnh & Mục tiêu",
        goals_subtitle: "Làm cho việc lập lịch nhân sự đơn giản, hiệu quả và không căng thẳng",
        goal1_title: "Đơn giản hóa lập lịch phức tạp",
        goal1_desc: "Biến công việc phức tạp thành quy trình 2 bước đơn giản.",
        goal2_title: "Giảm chi phí lao động",
        goal2_desc: "Giúp doanh nghiệp tối ưu chi phí lao động thông qua lập lịch thông minh.",
        goal3_title: "Cải thiện sự hài lòng của nhân viên",
        goal3_desc: "Tôn trọng khả năng và sở thích làm việc của nhân viên.",
        goal4_title: "Tiết kiệm thời gian quý giá",
        goal4_desc: "Loại bỏ hàng giờ tạo lịch thủ công.",
        goal5_title: "Đảm bảo tuân thủ & phủ sóng",
        goal5_desc: "Tự động đảm bảo yêu cầu tối thiểu về nhân sự và phân công trách nhiệm.",
        cta_title: "Sẵn sàng chuyển đổi việc lập lịch của bạn?",
        cta_subtitle: "Tham gia các doanh nghiệp đang dùng BScheduler để tối ưu lực lượng lao động",
        create_account_btn: "Tạo tài khoản miễn phí",
        start_scheduling_btn: "Bắt đầu lập lịch ngay",
        footer_text: "BScheduler © 2025",
        confidentiality_note: "Dữ liệu nhập là bảo mật và sẽ không được chia sẻ.",
        step1_label: "Chi tiết thời gian",
        step2_label: "Chi tiết nhân viên",
        step1_title: "Bước 1: Cấu hình cài đặt thời gian",
        step1_desc: "Thiết lập ngày làm việc, ca và yêu cầu lập lịch",
        step2_title: "Bước 2: Cấu hình nhân viên",
        step2_desc: "Thêm nhân viên và đặt khả năng, giờ và lương của họ",
        continue_btn: "Tiếp tục tới Chi tiết nhân viên",
        add_shift: "Thêm ca",
        shift_config: "Cấu hình ca",
        working_days: "Ngày làm việc",
        staffing_req: "Yêu cầu nhân sự",
        additional_settings: "Cài đặt bổ sung",
        back_btn: "Quay lại Chi tiết thời gian",
        generate_btn: "Tạo lịch",
        login_subtitle: "Truy cập tài khoản của bạn hoặc tạo tài khoản mới",
        signup_tab: "Đăng ký",
        username_label: "Tên đăng nhập",
        password_label: "Mật khẩu",
        login_btn: "Đăng nhập",
        min3: "Tối thiểu 3 ký tự",
        min6: "Tối thiểu 6 ký tự",
        email_label: "Email (tùy chọn)",
        confirm_password_label: "Xác nhận mật khẩu",
        or: "HOẶC",
        continue_guest: "Tiếp tục như Khách",
        back_home: "Quay lại Trang chủ"
    },
    nl: {
        app_title: "BScheduler",
        manager_dashboard: "Manager Dashboard",
        manage_your_employees: "Beheer uw medewerkers en maak roosters",
        add_employee: "Medewerker toevoegen",
        create_schedule: "Planning maken",
        your_employees: "Uw medewerkers",
        loading: "Bezig met laden...",
        no_employees_yet_title: "Nog geen medewerkers",
        no_employees_yet_text: "Voeg uw eerste medewerker toe om te beginnen",
        employee_name: "Naam medewerker",
        employment_type: "Dienstverband",
        part_time: "Deeltijd",
        full_time: "Voltijds",
        min_hours_week: "Min. uren/week",
        max_hours_week: "Max. uren/week",
        hourly_wage: "Uurloon",
        can_be_responsible: "Kan verantwoordelijke zijn",
        create_login_account: "Maak een loginaccount voor deze medewerker",
        username: "Gebruikersnaam",
        password: "Wachtwoord",
        employee_can_login_info: "Medewerker kan inloggen om beschikbaarheid in te stellen",
        cancel: "Annuleren",
        save_employee: "Opslaan",
    save_availability: "Beschikbaarheid Opslaan",
        edit: "Bewerken",
        delete: "Verwijderen",
        fulltime_badge: "Voltijds",
        parttime_badge: "Deeltijd",
        responsible_badge: "Verantwoordelijke",
        has_account: "Heeft account",
        no_account: "Geen account",
        min_label: "Min:",
        max_label: "Max:",
        confirm_delete: "Weet u zeker dat u %s wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
        please_provide_username_password: "Voer gebruikersnaam en wachtwoord in"
        ,logout: "Uitloggen"
        ,monday: "Maandag", tuesday: "Dinsdag", wednesday: "Woensdag", thursday: "Donderdag",
        friday: "Vrijdag", saturday: "Zaterdag", sunday: "Zondag",
        mon: "Ma", tue: "Di", wed: "Wo", thu: "Do", fri: "Vr", sat: "Za", sun: "Zo",
        morning: "Ochtend", afternoon: "Middag", evening: "Avond",
        employee: "Medewerker",
        availability_for: "Beschikbaarheid",
    availability_info: "Selecteer de dagen en diensten waarop u beschikbaar bent. Uw manager gebruikt deze informatie bij het opstellen van roosters.",
        weekly_hours: "Wekelijkse uren",
        min_hours: "Min. uren",
        max_hours: "Max. uren",
        unlimited: "Onbeperkt",
        fulltime: "Voltijds",
        hourly_wage: "Uurloon",
        apply_to_all: "Toepassen op alle medewerkers (behalve voltijds)",
        can_be_responsible: "Kan verantwoordelijke zijn",
        shift_name: "Dienstnaam",
        hours: "Uren",
        apply_same_minmax_all: "Zelfde min/max toepassen op alle diensten en dagen",
        apply_same_minmax_per_shift: "Zelfde min/max per dienst toepassen op elke dag",
        minimum_employees: "Minimale medewerkers",
        maximum_employees: "Maximale medewerkers",
        ignore_min_constraint: "Minimumeis negeren",
        ignore_max_constraint: "Maximumeis negeren",
        set_minmax_per_shift: "Stel min/max per diensttype in (van toepassing op alle dagen):",
        set_minmax_each_shift: "Stel min/max medewerkers in voor elke dienst (0 om te negeren):",
        min: "Min",
        max: "Max",
        fulltime_hours_label: "Werkuren voor een voltijdse werknemer (per week)",
        set_zero_ignore: "Stel in op 0 om te negeren",
        require_responsible: "Verantwoordelijke per dienst verplichtstellen",
        shift: "Dienst"
        ,please_select_days_shifts: "Selecteer eerst dagen en definieer diensten.",
        please_define_shifts: "Definieer eerst diensten.",
        must_have_one_shift: "U moet ten minste één dienst definiëren.",
        must_have_one_employee: "U moet ten minste één medewerker hebben.",
        no_employees_assigned: "Geen medewerkers toegewezen"
        ,
        hero_subtitle: "Werkroosters op maat voor de horeca in België. Bespaar tijd, verlaag kosten en houd uw team tevreden.",
        login_signup_btn: "Inloggen / Aanmelden",
        try_guest_btn: "Probeer zonder account",
        features_title: "Krachtige functies",
        features_subtitle: "Alles wat u nodig heeft om optimale werkroosters in enkele minuten te maken",
        feature1_title: "Flexibele dienstverbanden",
        feature1_desc: "Zowel fulltime als flexibele contractmedewerkers worden meegenomen in de planningsengine.",
        feature2_title: "Medewerkerbeschikbaarheid",
        feature2_desc: "Volg beschikbaarheid, stel min/max uren in en beheer uurlonen.",
        feature3_title: "Flexibel dienstbeheer",
        feature3_desc: "Definieer aangepaste diensten met verschillende duur en configureer personeelsvereisten.",
        feature4_title: "Kostenminimalisatie",
        feature4_desc: "Geavanceerde algoritmen genereren automatisch optimale roosters die kosten minimaliseren.",
        feature5_title: "Kostenanalyse",
        feature5_desc: "Krijg directe kostenberekeningen voor uw roosters.",
        feature6_title: "Opslaan & Herladen",
        feature6_desc: "Maak een account om uw roosters op te slaan en overal toegang te krijgen.",
        mission_title: "Onze missie & doelen",
        goals_subtitle: "Werkroosters eenvoudiger, efficiënter en stressvrij maken voor bedrijven van elke omvang",
        goal1_title: "Vereenvoudigen van complexe planning",
        goal1_desc: "Verander complexe planning in een eenvoudig 2-stappen proces.",
        goal2_title: "Arbeidskosten verlagen",
        goal2_desc: "Help bedrijven arbeidskosten te optimaliseren met slimme planning.",
        goal3_title: "Verbeter medewerkerstevredenheid",
        goal3_desc: "Respecteer beschikbaarheid en voorkeuren van medewerkers voor beter moraal.",
        goal4_title: "Bespaar waardevolle tijd",
        goal4_desc: "Elimineer uren handmatig werk en bereik resultaten in minuten.",
        goal5_title: "Zorg voor naleving & dekking",
        goal5_desc: "Zorg automatisch dat minimale personeelsvereisten worden gehaald en verantwoordelijken zijn toegewezen.",
        cta_title: "Klaar om uw planning te transformeren?",
        cta_subtitle: "Sluit u aan bij bedrijven die BScheduler gebruiken om hun personeel te optimaliseren",
        create_account_btn: "Maak gratis account",
        start_scheduling_btn: "Begin nu met plannen",
        footer_text: "BScheduler © 2025",
        confidentiality_note: "Ingevoerde gegevens zijn vertrouwelijk en worden niet gedeeld.",
        step1_label: "Tijdgegevens",
        step2_label: "Medewerkergegevens",
        step1_title: "Stap 1: Configureer tijdinstellingen",
        step1_desc: "Stel uw werkdagen, diensten en planningsvereisten in",
        step2_title: "Stap 2: Configureer medewerkers",
        step2_desc: "Voeg medewerkers toe en stel beschikbaarheid, uren en lonen in",
        continue_btn: "Doorgaan naar medewerkergegevens",
        add_shift: "Dienst toevoegen",
        shift_config: "Dienstconfiguratie",
        working_days: "Werkdagen",
        staffing_req: "Personeelsvereisten",
        additional_settings: "Aanvullende instellingen",
        back_btn: "Terug naar tijdgegevens",
        generate_btn: "Genereer rooster",
        login_subtitle: "Toegang tot uw account of maak een nieuw account",
        signup_tab: "Aanmelden",
        username_label: "Gebruikersnaam",
        password_label: "Wachtwoord",
        login_btn: "Inloggen",
        min3: "Minimaal 3 tekens",
        min6: "Minimaal 6 tekens",
        email_label: "E-mail (optioneel)",
        confirm_password_label: "Bevestig wachtwoord",
        or: "OF",
        continue_guest: "Doorgaan als gast",
        back_home: "Terug naar start"
    }
};

// determine current language: URL param 'lang' -> localStorage -> default 'en'
function _determineLang() {
    try {
        const params = new URLSearchParams(window.location.search);
        const langFromUrl = params.get('lang');
        const stored = (localStorage.getItem && localStorage.getItem('lang')) || null;
        return langFromUrl || stored || 'en';
    } catch (e) {
        return 'en';
    }
}

// central setter for language so pages can listen to changes and re-render dynamic parts
window.setLanguage = function(lang) {
    try { if (window) window.currentLanguage = lang; } catch(e) {}
    try { localStorage.setItem && localStorage.setItem('lang', lang); } catch(e) {}
    // re-apply translations to DOM
    try { window.applyTranslationsToDOM(); } catch (e) {}
    // dispatch an event so pages can re-render dynamic UI (grids, generated labels, etc.)
    try {
        const ev = new CustomEvent('languageChanged', { detail: { lang: lang } });
        document.dispatchEvent(ev);
    } catch (e) {}
    return lang;
};

// initialize currentLanguage in a way that triggers page listeners
window.currentLanguage = _determineLang();

window.t = function(key) {
    const lang = (window && window.currentLanguage) ? window.currentLanguage : 'en';
    return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
};

window.applyTranslationsToDOM = function() {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (key) {
            elem.textContent = window.t(key);
        }
    });
    // process elements that have a runtime key in data-i18n-key (e.g., shift labels populated by templates)
    document.querySelectorAll('[data-i18n-key]').forEach(elem => {
        try {
            const runtime = elem.getAttribute('data-i18n-key');
            if (!runtime) return;
            // normalize runtime values to keys used in translations (lowercase, spaces -> _)
            const key = runtime.toString().trim().toLowerCase().replace(/\s+/g, '_');
            const translated = window.t(key);
            // only change if a translation exists (t returns key when missing)
            if (translated && translated !== key) {
                elem.textContent = translated;
            }
        } catch(e) {}
    });
    // attach lang param to internal anchors and forms
    const lang = window.currentLanguage;
    document.querySelectorAll('a[href]').forEach(a => {
        try {
            const href = a.getAttribute('href');
            if (!href) return;
            if (href.startsWith('http') && (new URL(href)).origin !== location.origin) return;
            const url = new URL(href, location.origin);
            url.searchParams.set('lang', lang);
            if (href.startsWith('/')) {
                a.setAttribute('href', url.pathname + url.search + url.hash);
            } else {
                a.setAttribute('href', url.toString());
            }
        } catch (e) {}
    });
    document.querySelectorAll('form[action]').forEach(f => {
        try {
            const action = f.getAttribute('action');
            if (!action) return;
            if (action.startsWith('http') && (new URL(action)).origin !== location.origin) return;
            const url = new URL(action, location.origin);
            url.searchParams.set('lang', lang);
            if (action.startsWith('/')) {
                f.setAttribute('action', url.pathname + url.search + url.hash);
            } else {
                f.setAttribute('action', url.toString());
            }
        } catch (e) {}
    });
};

document.addEventListener('DOMContentLoaded', function() {
    // apply translations right away for static elements that use data-i18n
    window.applyTranslationsToDOM();
});

// expose the raw translations object so older scripts can read language-specific values
// (they should prefer using window.t(key) instead of accessing this directly)
window.translations = translations;
// update internal links/forms to carry lang param
function _updateLinksAndForms(lang) {
    try {
        document.querySelectorAll('a[href]').forEach(a => {
            try {
                const href = a.getAttribute('href');
                if (!href) return;
                if (href.startsWith('http') && (new URL(href)).origin !== location.origin) return;
                const url = new URL(href, location.origin);
                url.searchParams.set('lang', lang);
                if (href.startsWith('/')) {
                    a.setAttribute('href', url.pathname + url.search + url.hash);
                } else {
                    a.setAttribute('href', url.toString());
                }
            } catch (e) {}
        });

        document.querySelectorAll('form[action]').forEach(f => {
            try {
                const action = f.getAttribute('action');
                if (!action) return;
                if (action.startsWith('http') && (new URL(action)).origin !== location.origin) return;
                const url = new URL(action, location.origin);
                url.searchParams.set('lang', lang);
                if (action.startsWith('/')) {
                    f.setAttribute('action', url.pathname + url.search + url.hash);
                } else {
                    f.setAttribute('action', url.toString());
                }
            } catch (e) {}
        });
    } catch(e) {}
}

// ensure setLanguage also updates links/forms
const _origSetLanguage = window.setLanguage;
window.setLanguage = function(lang) {
    const result = _origSetLanguage(lang);
    try { _updateLinksAndForms(lang); } catch(e) {}
    try { window.dispatchEvent && window.dispatchEvent(new CustomEvent('languageChangedGlobal', { detail: { lang } })); } catch(e) {}
    return result;
};

// global listener in case pages don't bind their own change handlers
document.addEventListener('change', function(e) {
    try {
        const target = e.target;
        if (!target) return;
        if (target.id === 'languageSelector') {
            const lang = target.value;
            try { window.setLanguage(lang); } catch(er) { try { localStorage.setItem('lang', lang); } catch(_) {} }
        }
    } catch(e) {}
});

// Defer initial setLanguage slightly on DOMContentLoaded so page scripts have
// time to attach 'languageChanged' listeners. This reduces missed events.
document.addEventListener('DOMContentLoaded', function() {
    try {
        setTimeout(function() {
            try { window.setLanguage(window.currentLanguage || 'en'); } catch(e) {}
        }, 60);
    } catch(e) {}
});
